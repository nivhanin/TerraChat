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
def add_message_to_history(message):
    splits = text_splitter.split_documents([message])
    vectorstore.add_documents(documents=splits, embedding=mistral_embeddings)


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


# Main interaction loop
max_turns = 5
turn_count = 1
while turn_count < max_turns:
    print(f"Loop: {turn_count}")
    print("----------------------")
    # Collect user input dynamically
    message = input("You: ")
    if message.lower() == "exit":
        break
    add_message_to_history(message)

    # Update the prompt with user input
    user_prompt = {"input": message}
    # Generate response
    response = chain.invoke(input=user_prompt)
    print(response)

    # Extract JSON function if available
    json_function = extract_json_from_text(response)
    print(json_function)
    if json_function:
        function_name = json_function[0]["function_name"]
        function_params = json_function[0]["function_params"]
        if function_name not in available_actions:
            raise Exception(f"Unknown action: {function_name}: {function_params}")
        print(f" -- running {function_name} {function_params}")
        action_function = available_actions[function_name]
        # Call the function
        result = action_function(**function_params)
        function_result_message = f"Action_Response: {result}"
        # Update prompt for next turn
        user_prompt = {"input": function_result_message}
        print(function_result_message)
    else:
        break
    turn_count += 1
