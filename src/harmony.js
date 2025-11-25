/**
 * Harmony - Language Inclusivity Application
 * 
 * A student-centered app developed at BSU to promote language inclusivity
 * and better communication across our diverse campus.
 * 
 * Features:
 * - Speech-to-text: Convert spoken language to text
 * - Machine translation: Translate text between languages
 * - Text-to-speech: Read text aloud in different languages
 * 
 * Prioritizes accuracy in academic contexts — classroom terms, project
 * instructions, and formal conversations are treated with contextual care.
 */

import { SpeechToTextService } from './services/speechToText.js';
import { TranslationService } from './services/translation.js';
import { TextToSpeechService } from './services/textToSpeech.js';
import { academicContextConfig } from './config/academicContext.js';

/**
 * Harmony class
 * Main application class that integrates all language services
 */
export class Harmony {
  constructor(options = {}) {
    this.speechToText = new SpeechToTextService(options.speechToText);
    this.translation = new TranslationService(options.translation);
    this.textToSpeech = new TextToSpeechService(options.textToSpeech);
    this.isInitialized = false;
    this.currentLanguage = options.language || academicContextConfig.defaultSourceLanguage;
  }

  /**
   * Initialize all services
   * @returns {Object} Initialization status for each service
   */
  initialize() {
    const status = {
      speechToText: this.speechToText.initialize(),
      textToSpeech: this.textToSpeech.initialize(),
      translation: true // Translation service doesn't require initialization
    };

    this.isInitialized = Object.values(status).some(v => v);
    return status;
  }

  /**
   * Set the current language for all services
   * @param {string} language - Language code
   * @returns {boolean} Whether the language was set successfully
   */
  setLanguage(language) {
    const speechToTextResult = this.speechToText.setLanguage(language);
    const textToSpeechResult = this.textToSpeech.setLanguage(language);
    
    if (speechToTextResult && textToSpeechResult) {
      this.currentLanguage = language;
      return true;
    }
    return false;
  }

  /**
   * Get supported languages
   * @returns {Array} List of supported languages
   */
  getSupportedLanguages() {
    return academicContextConfig.supportedLanguages;
  }

  /**
   * Start listening for speech and get text
   * @param {Function} onResult - Callback for results
   * @param {Function} onError - Callback for errors
   * @returns {boolean} Whether listening started
   */
  startListening(onResult, onError) {
    return this.speechToText.startListening(onResult, onError);
  }

  /**
   * Stop listening for speech
   */
  stopListening() {
    this.speechToText.stopListening();
  }

  /**
   * Translate text
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Object>} Translation result
   */
  async translate(text, targetLanguage, sourceLanguage) {
    return this.translation.translate(text, {
      targetLanguage,
      sourceLanguage: sourceLanguage || this.currentLanguage
    });
  }

  /**
   * Speak text aloud
   * @param {string} text - Text to speak
   * @param {string} language - Language code (optional)
   * @returns {Promise<void>} Resolves when speech is complete
   */
  async speak(text, language) {
    return this.textToSpeech.speak(text, {
      language: language || this.currentLanguage
    });
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    this.textToSpeech.stop();
  }

  /**
   * Translate and speak text
   * @param {string} text - Text to translate and speak
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<Object>} Translation result
   */
  async translateAndSpeak(text, targetLanguage) {
    const result = await this.translate(text, targetLanguage);
    await this.speak(result.translatedText, targetLanguage);
    return result;
  }

  /**
   * Listen, translate, and speak - complete translation flow
   * Useful for real-time translation scenarios
   * @param {string} targetLanguage - Target language code
   * @param {Function} onTranslation - Callback for translation results
   * @param {Function} onError - Callback for errors
   */
  startRealTimeTranslation(targetLanguage, onTranslation, onError) {
    this.startListening(async (results) => {
      const finalResults = results.filter(r => r.isFinal);
      
      for (const result of finalResults) {
        try {
          const translation = await this.translate(result.transcript, targetLanguage);
          if (onTranslation) onTranslation(translation);
        } catch (error) {
          if (onError) onError(error);
        }
      }
    }, onError);
  }

  /**
   * Stop real-time translation
   */
  stopRealTimeTranslation() {
    this.stopListening();
  }

  /**
   * Get version information
   * @returns {Object} Version info
   */
  getVersion() {
    return {
      name: 'Harmony',
      version: '1.0.0',
      description: 'Language Inclusivity Application for BSU',
      features: [
        'Speech-to-Text',
        'Machine Translation',
        'Text-to-Speech'
      ]
    };
  }
}

export default Harmony;
