import json
import re
from typing import List


def _extract_full_json(text: str, start_index: int) -> str:
    """
    Extract the full JSON string starting from the given index.

    :param text: The input text.
    :param start_index: The index where the JSON object starts.
    :return: The complete JSON string, or None if not well-formed.
    """
    nest_count = 0
    end_index = start_index

    for i in range(start_index, len(text)):
        if text[i] == "{":
            nest_count += 1
        elif text[i] == "}":
            nest_count -= 1
            if nest_count == 0:
                end_index = i + 1
                break

    # Return the full JSON substring if valid
    return text[start_index:end_index] if nest_count == 0 else None


def extract_json_from_text(text_response: str) -> List[str]:
    """
    Extract JSON objects from a text string, handling nested structures.

    :param text_response: The input text containing JSON-like structures.
    :return: A list of JSON objects extracted from the text
    """
    # Pattern to find potential JSON objects
    pattern = re.compile(r"\{")
    matches = pattern.finditer(text_response)
    json_objects = []

    for match in matches:
        start = match.start()
        json_str = _extract_full_json(text_response, start)
        if json_str:
            try:
                json_obj = json.loads(json_str)
                json_objects.append(json_obj)
            except json.JSONDecodeError:
                continue

    return json_objects if json_objects else None
