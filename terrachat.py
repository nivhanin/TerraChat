import re
from helpers.json_helpers import extract_json_from_text
from prompts import react_system_prompt, contextualize_q_system_prompt
from sample_functions import get_weather
import time

import streamlit as st
from langchain.chains import create_history_aware_retriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_fixed
from langchain_google_genai import ChatGoogleGenerativeAI

from utils.logger import log

# llm_instance = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
# other params...
# )
# llm_gemini_ai_instance_flash_8b = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash-8b",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
# other params...
# )


st.header("TerraChat")

# Available actions are:
available_actions = {"get_weather": get_weather}

# Create LLM instance using Langchain
llm_instance = ChatMistralAI(model_name="open-mistral-nemo")
# llm_cohere_instance = ChatMistralAI(model_name="cohere")

# Initialize components for dynamic message retrieval - Memory feature
text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n"], chunk_size=1000, chunk_overlap=200, length_function=len
)
mistral_embeddings = MistralAIEmbeddings()
vectorstore = InMemoryVectorStore(mistral_embeddings)


@retry(
    stop=stop_after_attempt(3),
    wait=wait_fixed(2),
    retry=retry_if_exception_type(KeyError),
)
def _add_texts_to_vectorstore(splits):
    log.info(f"Adding splits to vectorstore: {splits}")
    vectorstore.add_texts(texts=splits)


def add_message_to_history(message_type: str, message: str):
    log.info(f"Adding message to history: {message}")
    # Add chat message user or AI response to chat history
    st.session_state.chat_history.append({"role": message_type, "content": message})

    splits = text_splitter.split_text(message)
    _add_texts_to_vectorstore(splits)

    time.sleep(2)  # Sleep for 2 second to allow rate limit to reset


# Set up the prompt template
prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", react_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("ai", "Welcome to the TerraChat, how can I help you?"),
        ("human", "{input}"),
    ]
)

# Set up the retriever - Memory feature
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
retriever = vectorstore.as_retriever()
history_aware_retriever = create_history_aware_retriever(
    llm_instance, retriever, contextualize_q_prompt
)

# Create LLM chain
chain = prompt_template | llm_instance | StrOutputParser()

# Initialize chat history
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Display chat messages from history on app rerun
for session_message in st.session_state.chat_history:
    with st.chat_message(session_message["role"]):
        st.markdown(session_message["content"])


def handle_user_input(user_question):
    with st.chat_message("user"):
        st.markdown(user_question)
    add_message_to_history("human", user_question)
    return {
        "input": user_question,
        "chat_history": st.session_state.chat_history,
    }


def run_chain_with_function_result(result):
    function_result_message = f"Action_Response: {result}"
    log.info(function_result_message)
    user_prompt = {
        "input": function_result_message,
        "chat_history": st.session_state.chat_history,
    }
    return chain.invoke(input=user_prompt)


def generate_response(user_prompt):
    response = chain.invoke(input=user_prompt)
    log.info(f"Initial response: {response}")
    return process_response(response)


def process_response(response):
    max_turns = 3
    turn_count = 1
    while turn_count < max_turns:
        log.info(f"Turn count: {turn_count}")
        json_function = extract_json_from_text(response)
        log.info(f"{json_function=}")
        if not json_function:
            break

        time.sleep(2)
        try:
            function_name = json_function[0]["function_name"]
            function_params = json_function[0]["function_params"]
        except KeyError as e:
            try:
                match = re.search(r"Answer:\s*(.+)", response, re.DOTALL)
                if match:
                    answer_data = match.group(1)
                else:
                    answer_data = response[0]
                    log.info("No answer data found!!!")
            except IndexError:
                answer_data = response[0]
                log.error("No answer data found!!!")
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
        response = run_chain_with_function_result(result)
        turn_count += 1
    return response


def main():
    # Main interaction loop - TerraChat assistant - start the conversation loop
    log.info("Starting new conversation - main loop")
    if user_question := st.chat_input("Type your question here:"):
        user_prompt = handle_user_input(user_question)
        # Display spinner while generating response
        # Generate response
        response = generate_response(user_prompt)
        with st.spinner("Assistant is thinking..."):
            with st.chat_message("ai"):
                log.info(f"Final response: {response}")
                # Add the AI response to history and inform the user
                try:
                    answer_data = response.split("Answer:")[1]
                except IndexError:
                    answer_data = response[0]
                    log.error("No answer data found!")
                add_message_to_history("ai", answer_data)
                st.markdown(answer_data)


if __name__ == "__main__":
    main()
