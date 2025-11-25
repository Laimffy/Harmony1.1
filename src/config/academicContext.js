/**
 * Academic Context Configuration
 * 
 * This configuration helps prioritize accuracy in academic contexts,
 * including classroom terms, project instructions, and formal conversations.
 */

export const academicContextConfig = {
  // Supported languages with their ISO codes
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
  ],

  // Default language settings
  defaultSourceLanguage: 'en',
  defaultTargetLanguage: 'en',

  // Academic terminology categories for contextual accuracy
  academicCategories: [
    'classroom',
    'laboratory',
    'library',
    'administration',
    'student-services',
    'campus-life'
  ],

  // Speech recognition settings optimized for academic environments
  speechRecognition: {
    continuous: true,
    interimResults: true,
    maxAlternatives: 3,
    // Enhanced for academic vocabulary
    academicMode: true
  },

  // Text-to-speech settings
  textToSpeech: {
    rate: 0.9, // Slightly slower for clarity
    pitch: 1.0,
    volume: 1.0
  },

  // Translation settings with academic context awareness
  translation: {
    preserveFormatting: true,
    formalTone: true, // Prefer formal language in academic contexts
    contextAware: true
  }
};

/**
 * Academic terminology glossary
 * Common terms that require special handling in translation
 */
export const academicGlossary = {
  // Classroom terms
  'syllabus': { category: 'classroom', formal: true },
  'lecture': { category: 'classroom', formal: true },
  'seminar': { category: 'classroom', formal: true },
  'tutorial': { category: 'classroom', formal: true },
  'assignment': { category: 'classroom', formal: true },
  'exam': { category: 'classroom', formal: true },
  'quiz': { category: 'classroom', formal: true },
  'midterm': { category: 'classroom', formal: true },
  'final': { category: 'classroom', formal: true },
  'grade': { category: 'classroom', formal: true },
  'GPA': { category: 'classroom', formal: true, preserve: true },
  'credits': { category: 'classroom', formal: true },
  'prerequisite': { category: 'classroom', formal: true },
  'office hours': { category: 'classroom', formal: true },

  // Project and research terms
  'thesis': { category: 'research', formal: true },
  'dissertation': { category: 'research', formal: true },
  'research paper': { category: 'research', formal: true },
  'peer review': { category: 'research', formal: true },
  'citation': { category: 'research', formal: true },
  'bibliography': { category: 'research', formal: true },
  'abstract': { category: 'research', formal: true },

  // Campus life terms
  'dormitory': { category: 'campus-life', formal: false },
  'dorm': { category: 'campus-life', formal: false },
  'cafeteria': { category: 'campus-life', formal: false },
  'student union': { category: 'campus-life', formal: true },
  'registrar': { category: 'administration', formal: true },
  'financial aid': { category: 'administration', formal: true },
  'scholarship': { category: 'administration', formal: true },
  'tuition': { category: 'administration', formal: true }
};

export default academicContextConfig;
