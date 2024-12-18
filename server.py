import re
import time
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains import create_history_aware_retriever
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pydantic import BaseModel
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_fixed

from embeddings.mistral import mistral_embeddings
from llms.mistral import llm_instance_mistral
from utils.helpers import is_env_var_set
from utils.json_helpers import extract_json_from_text
from prompts import contextualize_q_prompt
from rate_limiter import RateLimiterLLMChain
from tools import get_weather
from utils.logger import log


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define a model for incoming requests
class UserInput(BaseModel):
    question: str


@retry(
    stop=stop_after_attempt(10),
    wait=wait_fixed(2),
    retry=retry_if_exception_type(KeyError),
)
def _add_texts_to_vectorstore(splits):
    log.info(f"Adding splits to vectorstore: {splits}")
    vectorstore.add_texts(texts=splits)


def add_message_to_history(message_type: str, message: str, source: str = ""):
    log.info(f"Adding message to history: {message}")
    chat_message = {"role": message_type, "content": message}
    if source:
        chat_message["source"] = source
    log.info(f"Chat message: {chat_message}")
    app.state.chat_history.append(chat_message)

    splits = text_splitter.split_text(message)
    _add_texts_to_vectorstore(splits)

    time.sleep(2)


# Available actions are:
available_actions = {"get_weather": get_weather}
available_tools = [get_weather]

# Initialize components for dynamic message retrieval - Memory feature
text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n"], chunk_size=1000, chunk_overlap=200, length_function=len
)
vectorstore = InMemoryVectorStore(mistral_embeddings)


# Set up the retriever - Memory feature
retriever = vectorstore.as_retriever()
history_aware_retriever = create_history_aware_retriever(
    llm_instance_mistral, retriever, contextualize_q_prompt
)


# Initialize chat history and LLM chains
app.state.chat_history = [{"role": "ai", "content": "How may I assist you today?"}]
app.state.llm_chains = []
# Add LLM chains to the list if the API keys are set, Order of chains is important!
if is_env_var_set("OPENAI_API_KEY"):
    from llms.openai import openai_1_chain, openai_3_chain, openai_4_chain

    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=openai_1_chain,
            max_requests_per_minute=3,  # 3
            max_requests_per_day=3,  # 200
        )
    )
    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=openai_3_chain,
            max_requests_per_minute=3,  # 3
            max_requests_per_day=3,  # 200
        )
    )
    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=openai_4_chain,
            max_requests_per_minute=3,  # 3
            max_requests_per_day=100,  # 200
        )
    )
if is_env_var_set("GOOGLE_API_KEY"):
    from llms.google import (
        gemini_ai_flash_chain,
        gemini_ai_pro_chain,
        gemini_ai_flash_8b_chain,
    )

    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=gemini_ai_flash_chain,
            max_requests_per_minute=1,  # 15
            max_requests_per_day=1,  # 1500
        )
    )
    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=gemini_ai_pro_chain,
            max_requests_per_minute=1,  # 2
            max_requests_per_day=1,  # 50
        )
    )
    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=gemini_ai_flash_8b_chain,
            max_requests_per_minute=1,  # 15
            max_requests_per_day=1,  # 1500
        )
    )
if is_env_var_set("COHERE_API_KEY"):
    from llms.cohere import cohere_chain, cohere_plus_chain

    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=cohere_plus_chain,
            max_requests_per_minute=1,  # 20
            max_requests_per_day=1,  # 1000 per month (approx 32 per day)
        )
    )
    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=cohere_chain,
            max_requests_per_minute=1,  # 20
            max_requests_per_day=1,  # 1000 per month (approx 32 per day)
        )
    )
if is_env_var_set("XAI_API_KEY"):
    from llms.xai import xai_chain

    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=xai_chain,
            max_requests_per_minute=1,  # 60 RPM 1200 RPH -> 20 RPM
            max_requests_per_day=1,  # infinite
        )
    )
if is_env_var_set("MISTRAL_API_KEY"):
    from llms.mistral import mistral_chain

    app.state.llm_chains.append(
        RateLimiterLLMChain(
            llm_chain=mistral_chain,
            max_requests_per_minute=4,  # 30
            max_requests_per_day=1,  # infinite
        )
    )


@app.get("/llms")
async def llms():
    # return json response that validate if each llm api-key is valid (not none)
    return {
        "LANGCHAIN_API_KEY": is_env_var_set("LANGCHAIN_API_KEY"),
        "HF_TOKEN": is_env_var_set("HF_TOKEN"),
        "COHERE_API_KEY": is_env_var_set("COHERE_API_KEY"),
        "GOOGLE_API_KEY": is_env_var_set("GOOGLE_API_KEY"),
        "MISTRAL_API_KEY": is_env_var_set("MISTRAL_API_KEY"),
        "XAI_API_KEY": is_env_var_set("XAI_API_KEY"),
        "OPENAI_API_KEY": is_env_var_set("OPENAI_API_KEY"),
    }


@app.post("/ask")
async def ask_question(user_input: UserInput):
    user_question = user_input.question
    log.info(f"Received question: {user_question}")

    user_prompt = handle_user_input(user_question)
    response, model_name = generate_response(user_prompt, app.state.llm_chains)
    if not response:
        response = "No available LLM chain could provide a response."
        log.info(response)
        return {"response": response, "source": ""}

    log.info(f"Final response: {response}")
    try:
        answer_data = response.split("Answer:")[1]
    except IndexError:
        answer_data = response
        log.error("No 'Answer:' prefix found or no answer data after it!")

    add_message_to_history("ai", answer_data, source=model_name)
    return {"response": answer_data, "source": model_name}


def handle_user_input(user_question: str):
    add_message_to_history("human", user_question)
    return {
        "input": user_question,
        "chat_history": app.state.chat_history,
    }


def generate_response(user_prompt, chains):
    for llm_chain in chains:
        if llm_chain.is_in_cooldown():
            log.info(f"Skipping {llm_chain.model_name} due to cooldown.")
            continue

        response = llm_chain.run_invoke(user_prompt)
        if response:
            model_name = llm_chain.model_name
            log.info(f"Response from {model_name=}: {response}")
            app.state.model_name = model_name
            return process_response(response), model_name
    log.warning("No available LLM chain could provide a response.")
    return "No available LLM chain could provide a response.", ""


def process_response(response):
    max_turns = 3
    turn_count = 1
    while turn_count < max_turns:
        log.info(f"Turn count: {turn_count}")
        json_function = extract_json_from_text(response)
        log.info(f"{json_function=}")
        if not json_function:
            break

        try:
            function_name = json_function[0]["function_name"]
            function_params = json_function[0]["function_params"]
        except KeyError:
            match = re.search(r"Answer:\s*(.+)", response, re.DOTALL)
            if match:
                answer_data = match.group(1)
            else:
                answer_data = response
                log.info("bad regex: No answer data found!")
                log.info(
                    f"The response is natively contains a json format, "
                    f"but the action keys are not found"
                )
            return answer_data
        if function_name not in available_actions:
            log.warning(f"Unknown action: {function_name}: {function_params}")
            break

        log.info(f" -- running {function_name} {function_params}")
        result = available_actions[function_name](**function_params)
        response = run_chains_with_function_result(result, app.state.llm_chains)
        turn_count += 1
    return response


def run_chains_with_function_result(result, chains):
    function_result_message = f"Action_Response: {result}"
    log.info(function_result_message)
    user_prompt = {
        "input": function_result_message,
        "chat_history": app.state.chat_history,
    }
    for llm_chain in chains:
        response = llm_chain.run_invoke(user_prompt)
        if response:
            # Successfully invoked a chain, exit loop
            return response
    return "Error: No available LLM chain could provide a response."


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
