from langchain_xai import ChatXAI

from llms.base import parser
from prompts import prompt_template


llm_xai = ChatXAI(model="grok-2-1212")
# Setup chains - Create LLM chain
xai_chain = prompt_template | llm_xai | parser
