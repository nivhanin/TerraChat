from langchain_openai import ChatOpenAI

from llms.base import parser
from prompts import prompt_template


llm_openai_1 = ChatOpenAI(model="o1-mini")
llm_openai_4 = ChatOpenAI(model="gpt-4o-mini")
llm_openai_3 = ChatOpenAI(model="gpt-3.5-turbo")
# Setup chains - Create LLM chain
openai_1_chain = prompt_template | llm_openai_1 | parser
openai_4_chain = prompt_template | llm_openai_4 | parser
openai_3_chain = prompt_template | llm_openai_3 | parser
