/**
 * Tests for Speech-to-Text Service
 */

import { jest } from '@jest/globals';
import { SpeechToTextService } from '../src/services/speechToText.js';

describe('SpeechToTextService', () => {
  let speechToTextService;

  beforeEach(() => {
    speechToTextService = new SpeechToTextService();
  });

  describe('Constructor', () => {
    it('should initialize with default settings', () => {
      expect(speechToTextService.language).toBe('en');
      expect(speechToTextService.continuous).toBe(true);
      expect(speechToTextService.interimResults).toBe(true);
      expect(speechToTextService.academicMode).toBe(true);
      expect(speechToTextService.isListening).toBe(false);
    });

    it('should accept custom options', () => {
      const service = new SpeechToTextService({
        language: 'es',
        continuous: false,
        interimResults: false
      });
      expect(service.language).toBe('es');
      expect(service.continuous).toBe(false);
      expect(service.interimResults).toBe(false);
    });
  });

  describe('getLanguageCode', () => {
    it('should return full language code for supported languages', () => {
      expect(speechToTextService.getLanguageCode('en')).toBe('en-US');
      expect(speechToTextService.getLanguageCode('es')).toBe('es-ES');
      expect(speechToTextService.getLanguageCode('zh')).toBe('zh-CN');
      expect(speechToTextService.getLanguageCode('ja')).toBe('ja-JP');
    });

    it('should return original code for unsupported languages', () => {
      expect(speechToTextService.getLanguageCode('xyz')).toBe('xyz');
    });
  });

  describe('setLanguage', () => {
    it('should set language for supported languages', () => {
      expect(speechToTextService.setLanguage('es')).toBe(true);
      expect(speechToTextService.language).toBe('es');
    });

    it('should not set unsupported language', () => {
      expect(speechToTextService.setLanguage('xyz')).toBe(false);
      expect(speechToTextService.language).toBe('en');
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return list of supported languages', () => {
      const languages = speechToTextService.getSupportedLanguages();
      
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages.some(l => l.code === 'en')).toBe(true);
    });
  });

  describe('getIsListening', () => {
    it('should return false when not listening', () => {
      expect(speechToTextService.getIsListening()).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should return false in Node.js environment (no Web Speech API)', () => {
      // In Node.js environment, window is not defined
      expect(speechToTextService.initialize()).toBe(false);
    });
  });

  describe('startListening', () => {
    it('should call error callback when not initialized', () => {
      const onError = jest.fn();
      const result = speechToTextService.startListening(() => {}, onError);
      
      expect(result).toBe(false);
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('stopListening', () => {
    it('should not throw when called without initialization', () => {
      expect(() => speechToTextService.stopListening()).not.toThrow();
    });
  });
});
