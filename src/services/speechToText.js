/**
 * Speech-to-Text Service
 * 
 * Provides speech recognition functionality for the Harmony app.
 * Helps learners and visitors convert spoken language to text.
 */

import { academicContextConfig } from '../config/academicContext.js';

/**
 * SpeechToTextService class
 * Handles speech recognition with academic context awareness
 */
export class SpeechToTextService {
  constructor(options = {}) {
    this.language = options.language || academicContextConfig.defaultSourceLanguage;
    this.continuous = options.continuous ?? academicContextConfig.speechRecognition.continuous;
    this.interimResults = options.interimResults ?? academicContextConfig.speechRecognition.interimResults;
    this.maxAlternatives = options.maxAlternatives ?? academicContextConfig.speechRecognition.maxAlternatives;
    this.academicMode = options.academicMode ?? academicContextConfig.speechRecognition.academicMode;
    this.isListening = false;
    this.recognition = null;
  }

  /**
   * Initialize the speech recognition service
   * @returns {boolean} Whether initialization was successful
   */
  initialize() {
    // Check for browser support (Web Speech API)
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.configureRecognition();
      return true;
    }
    return false;
  }

  /**
   * Configure recognition settings
   */
  configureRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = this.interimResults;
    this.recognition.maxAlternatives = this.maxAlternatives;
    this.recognition.lang = this.getLanguageCode(this.language);
  }

  /**
   * Get the full language code for recognition
   * @param {string} langCode - Short language code (e.g., 'en')
   * @returns {string} Full language code (e.g., 'en-US')
   */
  getLanguageCode(langCode) {
    const languageMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'zh': 'zh-CN',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'vi': 'vi-VN',
      'ar': 'ar-SA',
      'hi': 'hi-IN'
    };
    return languageMap[langCode] || langCode;
  }

  /**
   * Set the language for speech recognition
   * @param {string} language - Language code
   */
  setLanguage(language) {
    const supportedLang = academicContextConfig.supportedLanguages.find(
      lang => lang.code === language
    );
    if (supportedLang) {
      this.language = language;
      if (this.recognition) {
        this.recognition.lang = this.getLanguageCode(language);
      }
      return true;
    }
    return false;
  }

  /**
   * Start listening for speech
   * @param {Function} onResult - Callback for speech results
   * @param {Function} onError - Callback for errors
   * @returns {boolean} Whether listening started successfully
   */
  startListening(onResult, onError) {
    if (!this.recognition) {
      if (onError) onError(new Error('Speech recognition not initialized'));
      return false;
    }

    if (this.isListening) {
      return true;
    }

    this.recognition.onresult = (event) => {
      const results = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        results.push({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal
        });
      }
      if (onResult) onResult(results);
    };

    this.recognition.onerror = (event) => {
      if (onError) onError(new Error(event.error));
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.continuous && this.shouldRestart) {
        this.recognition.start();
        this.isListening = true;
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
      this.shouldRestart = true;
      return true;
    } catch (error) {
      if (onError) onError(error);
      return false;
    }
  }

  /**
   * Stop listening for speech
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.shouldRestart = false;
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   * @returns {boolean} Whether currently listening
   */
  getIsListening() {
    return this.isListening;
  }

  /**
   * Get supported languages
   * @returns {Array} List of supported languages
   */
  getSupportedLanguages() {
    return academicContextConfig.supportedLanguages;
  }
}

export default SpeechToTextService;
