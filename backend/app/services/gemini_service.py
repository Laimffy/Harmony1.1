import google.generativeai as genai
from os import getenv

# Configure Gemini API
GEMINI_API_KEY = getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Translate text using Gemini API"""
    if not text.strip():
        return ""
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Translate the following text from {source_lang} to {target_lang}. Do not add any preamble or explanation, just the translated text.\n\nText: \"{text}\""
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as error:
        print(f"Error translating text: {error}")
        raise Exception("Failed to translate text.")

def get_chat_response(message: str, language: str) -> str:
    """Get chat response using Gemini API"""
    if not message.strip():
        return ""
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Respond to the following message in {language}. Be helpful and concise.\n\nMessage: \"{message}\""
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as error:
        print(f"Error getting chat response: {error}")
        raise Exception("Failed to get chat response.")
