import sys
import time

import streamlit as st
from langchain.chains import create_history_aware_retriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter

from sample_functions import get_weather
from prompts import (
    react_system_prompt,
    react_system_prompt2,
    contextualize_q_system_prompt,
)
from helpers.json_helpers import extract_json_from_text

st.header("TerraChat")

# Available actions are:
available_actions = {"get_weather": get_weather}

# Create LLM instance using Langchain
llm_instance = ChatMistralAI(model_name="open-mistral-nemo")

# Initialize components for dynamic message retrieval - Memory feature
text_splitter = RecursiveCharacterTextSplitter(
    separators=["\n"], chunk_size=1000, chunk_overlap=200, length_function=len
)
mistral_embeddings = MistralAIEmbeddings()
vectorstore = InMemoryVectorStore(mistral_embeddings)


# Function to update chat history
def add_message_to_history(history, message_type: str, message: str):
    print(f"Adding message to history: {message}")
    # splits = text_splitter.split_documents([message]) # split documents
    history.append((message_type, message))
    splits = text_splitter.split_text(message)
    print(f"Adding splits to vectorstore: {splits}")
    try:
        vectorstore.add_texts(texts=splits)
    except Exception as e:
        print(f"Error adding texts to vectorstore: {e}")
    time.sleep(2)  # Sleep for 1 second to allow rate limit to reset
    # vectorstore.add_documents(documents=splits, embedding=mistral_embeddings)


# Set up the prompt template
prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", react_system_prompt2),
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
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


def main():
    # Main interaction loop
    max_turns = 3
    turn_count = 1
    chat_history = []  # Initialize chat history

    # Start the conversation loop
    print("Starting new conversation - main loop")
    if user_question := st.chat_input("Type your question here:"):
        # Display user message in chat message container
        with st.chat_message("user"):
            st.markdown(user_question)
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": user_question})
        if user_question:
            # Collect user input dynamically
            message = user_question
            if message.lower() == "exit":
                sys.exit()
            add_message_to_history(chat_history, "human", message)
            # Update the prompt with user input
            user_prompt = {"input": message, "chat_history": chat_history}

            # Display spinner while generating response
            with st.spinner("Assistant is thinking..."):
                with st.chat_message("ai"):
                    # Generate response
                    response = chain.invoke(input=user_prompt)
                    print(f"Initial response: {response}")

                    while turn_count < max_turns and message:
                        print(f"Turn count: {turn_count}")
                        # Extract JSON function if available
                        json_function = extract_json_from_text(response)
                        print(f"{json_function=}")
                        if json_function:
                            print(f"Loop: {turn_count}")
                            print("----------------------")
                            # Sleep for 2 seconds to allow rate limit to reset
                            time.sleep(2)
                            function_name = json_function[0]["function_name"]
                            function_params = json_function[0]["function_params"]
                            if function_name not in available_actions:
                                print(
                                    f"Unknown action: {function_name}: {function_params}"
                                )
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
                            # Sleep for 1 second to allow rate limit to reset
                            time.sleep(1)
                            print(f"Response after action response sent: {response}")
                            turn_count += 1
                        else:
                            break

                    print(f"Final response: {response}")
                    # Add the AI response to history and inform the user
                    try:
                        answer_data = response.split("Answer:")[1]
                    except KeyError:
                        answer_data = response[0]
                        print("No answer data found!!!")
                    add_message_to_history(chat_history, "ai", answer_data)
                    st.markdown(answer_data)
                # Add assistant response to chat history
                st.session_state.messages.append({"role": "ai", "content": answer_data})


if __name__ == "__main__":
    main()
