/**
 * Tests for Harmony Main Class
 */

import { Harmony } from '../src/harmony.js';

describe('Harmony', () => {
  let harmony;

  beforeEach(() => {
    harmony = new Harmony();
  });

  describe('Constructor', () => {
    it('should initialize with default settings', () => {
      expect(harmony.currentLanguage).toBe('en');
      expect(harmony.isInitialized).toBe(false);
    });

    it('should accept custom language option', () => {
      const customHarmony = new Harmony({ language: 'es' });
      expect(customHarmony.currentLanguage).toBe('es');
    });

    it('should create all service instances', () => {
      expect(harmony.speechToText).toBeDefined();
      expect(harmony.translation).toBeDefined();
      expect(harmony.textToSpeech).toBeDefined();
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return list of supported languages', () => {
      const languages = harmony.getSupportedLanguages();
      
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
    });

    it('should include common languages', () => {
      const languages = harmony.getSupportedLanguages();
      const codes = languages.map(l => l.code);
      
      expect(codes).toContain('en');
      expect(codes).toContain('es');
      expect(codes).toContain('zh');
      expect(codes).toContain('fr');
    });
  });

  describe('setLanguage', () => {
    it('should set language for all services', () => {
      // First initialize to set up services
      harmony.initialize();
      
      const result = harmony.setLanguage('es');
      expect(result).toBe(true);
      expect(harmony.currentLanguage).toBe('es');
    });

    it('should return false for unsupported language', () => {
      harmony.initialize();
      
      const result = harmony.setLanguage('xyz');
      expect(result).toBe(false);
      expect(harmony.currentLanguage).toBe('en');
    });
  });

  describe('initialize', () => {
    it('should return initialization status', () => {
      const status = harmony.initialize();
      
      expect(status).toBeDefined();
      expect(typeof status.speechToText).toBe('boolean');
      expect(typeof status.textToSpeech).toBe('boolean');
      expect(status.translation).toBe(true);
    });
  });

  describe('translate', () => {
    it('should translate text using translation service', async () => {
      const result = await harmony.translate('Hello world', 'es');
      
      expect(result.originalText).toBe('Hello world');
      expect(result.sourceLanguage).toBe('en');
      expect(result.targetLanguage).toBe('es');
    });

    it('should use current language as source when not specified', async () => {
      harmony.currentLanguage = 'en';
      const result = await harmony.translate('Hello', 'fr');
      
      expect(result.sourceLanguage).toBe('en');
    });
  });

  describe('getVersion', () => {
    it('should return version information', () => {
      const version = harmony.getVersion();
      
      expect(version.name).toBe('Harmony');
      expect(version.version).toBeDefined();
      expect(version.description).toContain('BSU');
      expect(version.features).toContain('Speech-to-Text');
      expect(version.features).toContain('Machine Translation');
      expect(version.features).toContain('Text-to-Speech');
    });
  });

  describe('stopListening', () => {
    it('should not throw when called', () => {
      expect(() => harmony.stopListening()).not.toThrow();
    });
  });

  describe('stopSpeaking', () => {
    it('should not throw when called', () => {
      expect(() => harmony.stopSpeaking()).not.toThrow();
    });
  });

  describe('stopRealTimeTranslation', () => {
    it('should not throw when called', () => {
      expect(() => harmony.stopRealTimeTranslation()).not.toThrow();
    });
  });
});
