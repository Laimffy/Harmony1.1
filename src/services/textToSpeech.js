/**
 * Text-to-Speech Service
 * 
 * Provides text-to-speech functionality for the Harmony app.
 * Helps learners and visitors hear content spoken aloud.
 */

import { academicContextConfig } from '../config/academicContext.js';

/**
 * TextToSpeechService class
 * Handles text-to-speech with academic context awareness
 */
export class TextToSpeechService {
  constructor(options = {}) {
    this.language = options.language || academicContextConfig.defaultSourceLanguage;
    this.rate = options.rate ?? academicContextConfig.textToSpeech.rate;
    this.pitch = options.pitch ?? academicContextConfig.textToSpeech.pitch;
    this.volume = options.volume ?? academicContextConfig.textToSpeech.volume;
    this.voice = null;
    this.synthesis = null;
    this.isSpeaking = false;
  }

  /**
   * Initialize the text-to-speech service
   * @returns {boolean} Whether initialization was successful
   */
  initialize() {
    // Check for browser support (Web Speech API)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      return true;
    }
    return false;
  }

  /**
   * Get available voices for a language
   * @param {string} language - Language code
   * @returns {Array} Available voices
   */
  getVoicesForLanguage(language) {
    if (!this.synthesis) return [];

    const voices = this.synthesis.getVoices();
    const langCode = this.getLanguageCode(language);
    
    return voices.filter(voice => 
      voice.lang.startsWith(langCode.split('-')[0])
    );
  }

  /**
   * Get the full language code
   * @param {string} langCode - Short language code
   * @returns {string} Full language code
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
   * Set the language for text-to-speech
   * @param {string} language - Language code
   * @returns {boolean} Whether the language was set successfully
   */
  setLanguage(language) {
    const supportedLang = academicContextConfig.supportedLanguages.find(
      lang => lang.code === language
    );
    if (supportedLang) {
      this.language = language;
      // Try to find a matching voice
      const voices = this.getVoicesForLanguage(language);
      if (voices.length > 0) {
        this.voice = voices[0];
      }
      return true;
    }
    return false;
  }

  /**
   * Set the voice for text-to-speech
   * @param {SpeechSynthesisVoice} voice - Voice to use
   */
  setVoice(voice) {
    this.voice = voice;
  }

  /**
   * Set the speech rate
   * @param {number} rate - Speech rate (0.1 to 10)
   */
  setRate(rate) {
    if (rate >= 0.1 && rate <= 10) {
      this.rate = rate;
    }
  }

  /**
   * Set the pitch
   * @param {number} pitch - Pitch (0 to 2)
   */
  setPitch(pitch) {
    if (pitch >= 0 && pitch <= 2) {
      this.pitch = pitch;
    }
  }

  /**
   * Set the volume
   * @param {number} volume - Volume (0 to 1)
   */
  setVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.volume = volume;
    }
  }

  /**
   * Speak text
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   * @returns {Promise<void>} Resolves when speech is complete
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Text-to-speech not initialized'));
        return;
      }

      // Cancel any ongoing speech
      if (this.isSpeaking) {
        this.stop();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language
      utterance.lang = this.getLanguageCode(options.language || this.language);
      
      // Set voice if available
      if (options.voice || this.voice) {
        utterance.voice = options.voice || this.voice;
      }
      
      // Set rate, pitch, volume
      utterance.rate = options.rate ?? this.rate;
      utterance.pitch = options.pitch ?? this.pitch;
      utterance.volume = options.volume ?? this.volume;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        reject(new Error(event.error));
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop speaking
   */
  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Pause speaking
   */
  pause() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Check if currently speaking
   * @returns {boolean} Whether currently speaking
   */
  getIsSpeaking() {
    return this.isSpeaking;
  }

  /**
   * Get all available voices
   * @returns {Array} All available voices
   */
  getAllVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Get supported languages
   * @returns {Array} List of supported languages
   */
  getSupportedLanguages() {
    return academicContextConfig.supportedLanguages;
  }
}

export default TextToSpeechService;
