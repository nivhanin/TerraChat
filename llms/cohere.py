from langchain_cohere import ChatCohere

from llms.base import parser
from prompts import prompt_template


llm_cohere_plus = ChatCohere(model="command-r-plus-08-2024")
llm_cohere = ChatCohere(model="command-r-08-2024")
# Setup chains - Create LLM chain
cohere_plus_chain = prompt_template | llm_cohere_plus | parser
cohere_chain = prompt_template | llm_cohere | parser
