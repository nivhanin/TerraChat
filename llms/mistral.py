from langchain_mistralai import ChatMistralAI

from llms.base import parser
from prompts import prompt_template


llm_instance_mistral = ChatMistralAI(model_name="open-mistral-nemo")
# Setup chains - Create LLM chain
mistral_chain = prompt_template | llm_instance_mistral | parser
