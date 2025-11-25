/**
 * Tests for Academic Context Configuration
 */

import { academicContextConfig, academicGlossary } from '../src/config/academicContext.js';

describe('Academic Context Configuration', () => {
  describe('Supported Languages', () => {
    it('should have a list of supported languages', () => {
      expect(academicContextConfig.supportedLanguages).toBeDefined();
      expect(Array.isArray(academicContextConfig.supportedLanguages)).toBe(true);
      expect(academicContextConfig.supportedLanguages.length).toBeGreaterThan(0);
    });

    it('should include English as a supported language', () => {
      const english = academicContextConfig.supportedLanguages.find(
        lang => lang.code === 'en'
      );
      expect(english).toBeDefined();
      expect(english.name).toBe('English');
    });

    it('each language should have code, name, and nativeName', () => {
      academicContextConfig.supportedLanguages.forEach(lang => {
        expect(lang.code).toBeDefined();
        expect(lang.name).toBeDefined();
        expect(lang.nativeName).toBeDefined();
      });
    });
  });

  describe('Default Settings', () => {
    it('should have default source language', () => {
      expect(academicContextConfig.defaultSourceLanguage).toBe('en');
    });

    it('should have default target language', () => {
      expect(academicContextConfig.defaultTargetLanguage).toBe('en');
    });
  });

  describe('Academic Categories', () => {
    it('should have academic categories defined', () => {
      expect(academicContextConfig.academicCategories).toBeDefined();
      expect(Array.isArray(academicContextConfig.academicCategories)).toBe(true);
    });

    it('should include classroom category', () => {
      expect(academicContextConfig.academicCategories).toContain('classroom');
    });
  });

  describe('Speech Recognition Settings', () => {
    it('should have speech recognition configuration', () => {
      expect(academicContextConfig.speechRecognition).toBeDefined();
      expect(academicContextConfig.speechRecognition.continuous).toBe(true);
      expect(academicContextConfig.speechRecognition.academicMode).toBe(true);
    });
  });

  describe('Text-to-Speech Settings', () => {
    it('should have text-to-speech configuration', () => {
      expect(academicContextConfig.textToSpeech).toBeDefined();
      expect(academicContextConfig.textToSpeech.rate).toBeDefined();
      expect(academicContextConfig.textToSpeech.pitch).toBeDefined();
    });

    it('should have slightly slower rate for clarity', () => {
      expect(academicContextConfig.textToSpeech.rate).toBeLessThan(1.0);
    });
  });

  describe('Translation Settings', () => {
    it('should have translation configuration', () => {
      expect(academicContextConfig.translation).toBeDefined();
      expect(academicContextConfig.translation.formalTone).toBe(true);
      expect(academicContextConfig.translation.contextAware).toBe(true);
    });
  });
});

describe('Academic Glossary', () => {
  it('should have glossary entries', () => {
    expect(academicGlossary).toBeDefined();
    expect(Object.keys(academicGlossary).length).toBeGreaterThan(0);
  });

  it('should include common academic terms', () => {
    expect(academicGlossary['syllabus']).toBeDefined();
    expect(academicGlossary['lecture']).toBeDefined();
    expect(academicGlossary['exam']).toBeDefined();
  });

  it('GPA should be marked for preservation', () => {
    expect(academicGlossary['GPA']).toBeDefined();
    expect(academicGlossary['GPA'].preserve).toBe(true);
  });

  it('each term should have category and formal flag', () => {
    Object.entries(academicGlossary).forEach(([, metadata]) => {
      expect(metadata.category).toBeDefined();
      expect(typeof metadata.formal).toBe('boolean');
    });
  });
});
