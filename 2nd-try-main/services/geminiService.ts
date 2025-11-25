import { GoogleGenAI } from "@google/genai";

// Access the API key from Vite's environment variables
const apiKey = (import.meta as any).env.VITE_API_KEY as string;
if (!apiKey) {
  throw new Error("VITE_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  if (!text.trim()) return '';
  try {
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Do not add any preamble or explanation, just the translated text.\n\nText: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    return response.text?.trim() || '';
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Failed to translate text. Please check your API key and try again.");
  }
};

// Use browser's built-in Speech Synthesis for TTS
export const textToSpeech = async (text: string, lang: string = 'en'): Promise<string> => {
  if (!text.trim()) return '';
  
  // Use Web Speech API for text-to-speech
  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Map language codes to speech synthesis language
      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'es': 'es-ES',
        'tl': 'fil-PH', // Filipino/Tagalog
        'zh': 'zh-CN',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT',
        'pt': 'pt-BR',
        'ru': 'ru-RU',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
      };
      
      utterance.lang = langMap[lang] || lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => resolve('spoken');
      utterance.onerror = () => resolve('');
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported");
      resolve('');
    }
  });
};

// Helper to speak text directly (for replay functionality)
export const speakText = (text: string, lang: string = 'en'): void => {
  if ('speechSynthesis' in window && text.trim()) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'es': 'es-ES', 
      'tl': 'fil-PH',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'ar': 'ar-SA',
      'hi': 'hi-IN',
    };
    
    utterance.lang = langMap[lang] || lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};
