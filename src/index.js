/**
 * Harmony - Language Inclusivity Application
 * 
 * A student-centered app developed at BSU to promote language inclusivity
 * and better communication across our diverse campus.
 */

export { Harmony } from './harmony.js';
export { SpeechToTextService } from './services/speechToText.js';
export { TranslationService } from './services/translation.js';
export { TextToSpeechService } from './services/textToSpeech.js';
export { academicContextConfig, academicGlossary } from './config/academicContext.js';

// Default export
import Harmony from './harmony.js';
export default Harmony;
