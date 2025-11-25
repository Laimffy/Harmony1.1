/**
 * Tests for Translation Service
 */

import { TranslationService } from '../src/services/translation.js';

describe('TranslationService', () => {
  let translationService;

  beforeEach(() => {
    translationService = new TranslationService();
  });

  describe('Constructor', () => {
    it('should initialize with default settings', () => {
      expect(translationService.sourceLanguage).toBe('en');
      expect(translationService.targetLanguage).toBe('en');
      expect(translationService.formalTone).toBe(true);
      expect(translationService.contextAware).toBe(true);
    });

    it('should accept custom options', () => {
      const service = new TranslationService({
        sourceLanguage: 'es',
        targetLanguage: 'fr',
        formalTone: false
      });
      expect(service.sourceLanguage).toBe('es');
      expect(service.targetLanguage).toBe('fr');
      expect(service.formalTone).toBe(false);
    });
  });

  describe('isLanguageSupported', () => {
    it('should return true for supported languages', () => {
      expect(translationService.isLanguageSupported('en')).toBe(true);
      expect(translationService.isLanguageSupported('es')).toBe(true);
      expect(translationService.isLanguageSupported('zh')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(translationService.isLanguageSupported('xyz')).toBe(false);
      expect(translationService.isLanguageSupported('')).toBe(false);
    });
  });

  describe('setSourceLanguage', () => {
    it('should set source language for supported languages', () => {
      expect(translationService.setSourceLanguage('es')).toBe(true);
      expect(translationService.sourceLanguage).toBe('es');
    });

    it('should not set unsupported source language', () => {
      expect(translationService.setSourceLanguage('xyz')).toBe(false);
      expect(translationService.sourceLanguage).toBe('en');
    });
  });

  describe('setTargetLanguage', () => {
    it('should set target language for supported languages', () => {
      expect(translationService.setTargetLanguage('fr')).toBe(true);
      expect(translationService.targetLanguage).toBe('fr');
    });

    it('should not set unsupported target language', () => {
      expect(translationService.setTargetLanguage('xyz')).toBe(false);
      expect(translationService.targetLanguage).toBe('en');
    });
  });

  describe('identifyAcademicTerms', () => {
    it('should identify academic terms in text', () => {
      const text = 'Please check the syllabus for your exam schedule.';
      const terms = translationService.identifyAcademicTerms(text);
      
      expect(terms.length).toBeGreaterThan(0);
      expect(terms.some(t => t.term === 'syllabus')).toBe(true);
      expect(terms.some(t => t.term === 'exam')).toBe(true);
    });

    it('should return empty array for text without academic terms', () => {
      const text = 'Hello, how are you today?';
      const terms = translationService.identifyAcademicTerms(text);
      
      expect(terms.length).toBe(0);
    });

    it('should identify GPA as a term to preserve', () => {
      const text = 'Your GPA is important for graduation.';
      const terms = translationService.identifyAcademicTerms(text);
      
      const gpaTerm = terms.find(t => t.term === 'GPA');
      expect(gpaTerm).toBeDefined();
      expect(gpaTerm.preserve).toBe(true);
    });
  });

  describe('translate', () => {
    it('should return original text when source and target are the same', async () => {
      const result = await translationService.translate('Hello world', {
        sourceLanguage: 'en',
        targetLanguage: 'en'
      });

      expect(result.originalText).toBe('Hello world');
      expect(result.translatedText).toBe('Hello world');
      expect(result.confidence).toBe(1.0);
    });

    it('should include academic terms in result', async () => {
      const result = await translationService.translate(
        'Check the syllabus for exam dates.',
        { sourceLanguage: 'en', targetLanguage: 'es' }
      );

      expect(result.academicTerms).toBeDefined();
      expect(Array.isArray(result.academicTerms)).toBe(true);
    });

    it('should throw error for unsupported source language', async () => {
      await expect(
        translationService.translate('Hello', {
          sourceLanguage: 'xyz',
          targetLanguage: 'en'
        })
      ).rejects.toThrow('Source language \'xyz\' is not supported');
    });

    it('should throw error for unsupported target language', async () => {
      await expect(
        translationService.translate('Hello', {
          sourceLanguage: 'en',
          targetLanguage: 'xyz'
        })
      ).rejects.toThrow('Target language \'xyz\' is not supported');
    });

    it('should preserve terms marked for preservation', async () => {
      const result = await translationService.translate(
        'My GPA is 3.5',
        { sourceLanguage: 'en', targetLanguage: 'es' }
      );

      expect(result.translatedText).toContain('GPA');
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return list of supported languages', () => {
      const languages = translationService.getSupportedLanguages();
      
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages.some(l => l.code === 'en')).toBe(true);
    });
  });

  describe('detectLanguage', () => {
    it('should return detected language info', async () => {
      const result = await translationService.detectLanguage('Hello world');
      
      expect(result.detectedLanguage).toBeDefined();
      expect(result.confidence).toBeDefined();
    });
  });
});
