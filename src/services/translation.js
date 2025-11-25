/**
 * Translation Service
 * 
 * Provides machine translation functionality for the Harmony app.
 * Helps learners and visitors understand content in their preferred language.
 * Prioritizes accuracy in academic contexts with contextual care.
 */

import { academicContextConfig, academicGlossary } from '../config/academicContext.js';

/**
 * TranslationService class
 * Handles translation with academic context awareness
 */
export class TranslationService {
  constructor(options = {}) {
    this.sourceLanguage = options.sourceLanguage || academicContextConfig.defaultSourceLanguage;
    this.targetLanguage = options.targetLanguage || academicContextConfig.defaultTargetLanguage;
    this.preserveFormatting = options.preserveFormatting ?? academicContextConfig.translation.preserveFormatting;
    this.formalTone = options.formalTone ?? academicContextConfig.translation.formalTone;
    this.contextAware = options.contextAware ?? academicContextConfig.translation.contextAware;
  }

  /**
   * Translate text from source to target language
   * @param {string} text - Text to translate
   * @param {Object} options - Translation options
   * @returns {Promise<Object>} Translation result
   */
  async translate(text, options = {}) {
    const sourceLang = options.sourceLanguage || this.sourceLanguage;
    const targetLang = options.targetLanguage || this.targetLanguage;

    // Validate languages
    if (!this.isLanguageSupported(sourceLang)) {
      throw new Error(`Source language '${sourceLang}' is not supported`);
    }
    if (!this.isLanguageSupported(targetLang)) {
      throw new Error(`Target language '${targetLang}' is not supported`);
    }

    // If same language, return original
    if (sourceLang === targetLang) {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        confidence: 1.0,
        academicTerms: []
      };
    }

    // Identify academic terms for special handling
    const academicTerms = this.identifyAcademicTerms(text);

    // Process translation with academic context
    const translatedText = await this.processTranslation(text, sourceLang, targetLang, academicTerms);

    return {
      originalText: text,
      translatedText: translatedText,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      confidence: 0.95, // Placeholder confidence score
      academicTerms: academicTerms,
      formalTone: this.formalTone
    };
  }

  /**
   * Identify academic terms in the text
   * @param {string} text - Text to analyze
   * @returns {Array} Found academic terms
   */
  identifyAcademicTerms(text) {
    const foundTerms = [];
    const lowerText = text.toLowerCase();

    for (const [term, metadata] of Object.entries(academicGlossary)) {
      if (lowerText.includes(term.toLowerCase())) {
        foundTerms.push({
          term: term,
          ...metadata
        });
      }
    }

    return foundTerms;
  }

  /**
   * Process translation with academic context awareness
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language
   * @param {string} targetLang - Target language
   * @param {Array} academicTerms - Identified academic terms
   * @returns {Promise<string>} Translated text
   */
  async processTranslation(text, sourceLang, targetLang, academicTerms) {
    // In a production environment, this would call an external translation API
    // For now, we provide a framework that demonstrates the academic context handling

    // Preserve terms that should not be translated (like GPA)
    let processedText = text;
    const preservedTerms = [];

    academicTerms.forEach((term, index) => {
      if (term.preserve) {
        const placeholder = `__PRESERVED_${index}__`;
        processedText = processedText.replace(new RegExp(term.term, 'gi'), placeholder);
        preservedTerms.push({ placeholder, term: term.term });
      }
    });

    // This is a placeholder for actual translation API call
    // In production, integrate with services like Google Translate, DeepL, etc.
    let translatedText = processedText;

    // Restore preserved terms
    preservedTerms.forEach(({ placeholder, term }) => {
      translatedText = translatedText.replace(placeholder, term);
    });

    return translatedText;
  }

  /**
   * Check if a language is supported
   * @param {string} langCode - Language code to check
   * @returns {boolean} Whether the language is supported
   */
  isLanguageSupported(langCode) {
    return academicContextConfig.supportedLanguages.some(lang => lang.code === langCode);
  }

  /**
   * Set source language
   * @param {string} language - Language code
   * @returns {boolean} Whether the language was set successfully
   */
  setSourceLanguage(language) {
    if (this.isLanguageSupported(language)) {
      this.sourceLanguage = language;
      return true;
    }
    return false;
  }

  /**
   * Set target language
   * @param {string} language - Language code
   * @returns {boolean} Whether the language was set successfully
   */
  setTargetLanguage(language) {
    if (this.isLanguageSupported(language)) {
      this.targetLanguage = language;
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
   * Detect the language of given text
   * @param {string} text - Text to analyze
   * @returns {Promise<Object>} Detected language info
   */
  // eslint-disable-next-line no-unused-vars
  async detectLanguage(text) {
    // Placeholder for language detection
    // In production, integrate with language detection API
    return {
      detectedLanguage: 'en',
      confidence: 0.95,
      alternatives: []
    };
  }
}

export default TranslationService;
