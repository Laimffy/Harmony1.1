/**
 * Tests for Text-to-Speech Service
 */

import { TextToSpeechService } from '../src/services/textToSpeech.js';

describe('TextToSpeechService', () => {
  let textToSpeechService;

  beforeEach(() => {
    textToSpeechService = new TextToSpeechService();
  });

  describe('Constructor', () => {
    it('should initialize with default settings', () => {
      expect(textToSpeechService.language).toBe('en');
      expect(textToSpeechService.rate).toBe(0.9);
      expect(textToSpeechService.pitch).toBe(1.0);
      expect(textToSpeechService.volume).toBe(1.0);
      expect(textToSpeechService.isSpeaking).toBe(false);
    });

    it('should accept custom options', () => {
      const service = new TextToSpeechService({
        language: 'fr',
        rate: 0.8,
        pitch: 1.2,
        volume: 0.5
      });
      expect(service.language).toBe('fr');
      expect(service.rate).toBe(0.8);
      expect(service.pitch).toBe(1.2);
      expect(service.volume).toBe(0.5);
    });
  });

  describe('getLanguageCode', () => {
    it('should return full language code for supported languages', () => {
      expect(textToSpeechService.getLanguageCode('en')).toBe('en-US');
      expect(textToSpeechService.getLanguageCode('es')).toBe('es-ES');
      expect(textToSpeechService.getLanguageCode('fr')).toBe('fr-FR');
      expect(textToSpeechService.getLanguageCode('de')).toBe('de-DE');
    });

    it('should return original code for unknown languages', () => {
      expect(textToSpeechService.getLanguageCode('xyz')).toBe('xyz');
    });
  });

  describe('setLanguage', () => {
    it('should set language for supported languages', () => {
      expect(textToSpeechService.setLanguage('fr')).toBe(true);
      expect(textToSpeechService.language).toBe('fr');
    });

    it('should not set unsupported language', () => {
      expect(textToSpeechService.setLanguage('xyz')).toBe(false);
      expect(textToSpeechService.language).toBe('en');
    });
  });

  describe('setRate', () => {
    it('should set valid rate values', () => {
      textToSpeechService.setRate(0.5);
      expect(textToSpeechService.rate).toBe(0.5);

      textToSpeechService.setRate(2.0);
      expect(textToSpeechService.rate).toBe(2.0);
    });

    it('should not set invalid rate values', () => {
      const originalRate = textToSpeechService.rate;
      
      textToSpeechService.setRate(0);
      expect(textToSpeechService.rate).toBe(originalRate);
      
      textToSpeechService.setRate(15);
      expect(textToSpeechService.rate).toBe(originalRate);
    });
  });

  describe('setPitch', () => {
    it('should set valid pitch values', () => {
      textToSpeechService.setPitch(0.5);
      expect(textToSpeechService.pitch).toBe(0.5);

      textToSpeechService.setPitch(1.5);
      expect(textToSpeechService.pitch).toBe(1.5);
    });

    it('should not set invalid pitch values', () => {
      const originalPitch = textToSpeechService.pitch;
      
      textToSpeechService.setPitch(-1);
      expect(textToSpeechService.pitch).toBe(originalPitch);
      
      textToSpeechService.setPitch(3);
      expect(textToSpeechService.pitch).toBe(originalPitch);
    });
  });

  describe('setVolume', () => {
    it('should set valid volume values', () => {
      textToSpeechService.setVolume(0.5);
      expect(textToSpeechService.volume).toBe(0.5);

      textToSpeechService.setVolume(0);
      expect(textToSpeechService.volume).toBe(0);
    });

    it('should not set invalid volume values', () => {
      const originalVolume = textToSpeechService.volume;
      
      textToSpeechService.setVolume(-0.5);
      expect(textToSpeechService.volume).toBe(originalVolume);
      
      textToSpeechService.setVolume(1.5);
      expect(textToSpeechService.volume).toBe(originalVolume);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return list of supported languages', () => {
      const languages = textToSpeechService.getSupportedLanguages();
      
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages.some(l => l.code === 'en')).toBe(true);
    });
  });

  describe('getIsSpeaking', () => {
    it('should return false when not speaking', () => {
      expect(textToSpeechService.getIsSpeaking()).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should return false in Node.js environment (no Web Speech API)', () => {
      expect(textToSpeechService.initialize()).toBe(false);
    });
  });

  describe('speak', () => {
    it('should reject when not initialized', async () => {
      await expect(textToSpeechService.speak('Hello')).rejects.toThrow(
        'Text-to-speech not initialized'
      );
    });
  });

  describe('stop', () => {
    it('should not throw when called without initialization', () => {
      expect(() => textToSpeechService.stop()).not.toThrow();
    });
  });

  describe('getAllVoices', () => {
    it('should return empty array when not initialized', () => {
      expect(textToSpeechService.getAllVoices()).toEqual([]);
    });
  });

  describe('getVoicesForLanguage', () => {
    it('should return empty array when not initialized', () => {
      expect(textToSpeechService.getVoicesForLanguage('en')).toEqual([]);
    });
  });
});
