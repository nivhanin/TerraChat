from langchain_google_genai import ChatGoogleGenerativeAI

from llms.base import parser
from prompts import prompt_template


llm_gemini_ai_instance_pro = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)
llm_gemini_ai_instance_flash = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)
llm_gemini_ai_instance_flash_8b = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash-8b",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)
# Setup chains - Create LLM chain
gemini_ai_pro_chain = prompt_template | llm_gemini_ai_instance_pro | parser
gemini_ai_flash_chain = prompt_template | llm_gemini_ai_instance_flash | parser
gemini_ai_flash_8b_chain = prompt_template | llm_gemini_ai_instance_flash_8b | parser
