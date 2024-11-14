import sys
import time

from langchain.chains import create_history_aware_retriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter

from sample_functions import get_weather
from prompts import react_system_prompt, contextualize_q_system_prompt
from helpers.json_helpers import extract_json_from_text


# Available actions are:
available_actions = {"get_weather": get_weather}

# Create LLM instance using Langchain
llm_instance = ChatMistralAI(model_name="open-mistral-nemo")

# Initialize components for dynamic message retrieval - Memory feature
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
mistral_embeddings = MistralAIEmbeddings()
vectorstore = InMemoryVectorStore(mistral_embeddings)


# Function to update chat history
def add_message_to_history(history, message_type: str, message: str):
    print(f"Adding message to history: {message}")
    # splits = text_splitter.split_documents([message]) # split documents
    history.append((message_type, message))
    splits = text_splitter.split_text(message)
    vectorstore.add_texts(texts=splits)
    time.sleep(2)  # Sleep for 1 second to allow rate limit to reset
    # vectorstore.add_documents(documents=splits, embedding=mistral_embeddings)


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


def main():
    # Main interaction loop
    max_turns = 5
    turn_count = 1
    chat_history = []  # Initialize chat history

    while True:
        # Collect user input dynamically
        message = input("You: ")
        if message.lower() == "exit":
            sys.exit()
        add_message_to_history(chat_history, "human", message)

        # Update the prompt with user input
        user_prompt = {"input": message, "chat_history": chat_history}
        # Generate response
        response = chain.invoke(input=user_prompt)
        print(f"initial response: {response}")

        while turn_count < max_turns:
            # Extract JSON function if available
            json_function = extract_json_from_text(response)
            print(f"{json_function=}")
            if json_function:
                print(f"Loop: {turn_count}")
                print("----------------------")
                time.sleep(1)  # Sleep for 1 second to allow rate limit to reset
                function_name = json_function[0]["function_name"]
                function_params = json_function[0]["function_params"]
                if function_name not in available_actions:
                    print(f"Unknown action: {function_name}: {function_params}")
                print(f" -- running {function_name} {function_params}")
                action_function = available_actions[function_name]
                # Call the function
                result = action_function(**function_params)
                function_result_message = f"Action_Response: {result}"
                # Update prompt for next turn
                print(function_result_message)
                # Generate a new AI response based on the action result
                user_prompt = {
                    "input": function_result_message,
                    "chat_history": chat_history,
                }
                response = chain.invoke(input=user_prompt)
                time.sleep(1)  # Sleep for 1 second to allow rate limit to reset
                print(f"response after action response sent: {response}")
                turn_count += 1
            else:
                break

        print(f"Final response: {response}")
        # Add the AI response to history and inform the user
        add_message_to_history(chat_history, "ai", response.split("Answer:")[1])


if __name__ == "__main__":
    main()
