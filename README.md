# Harmony

A student-centered app developed at BSU to promote language inclusivity and better communication across our diverse campus.

## Overview

Harmony helps learners and visitors speak, understand, and participate in classroom and campus life using:

- **Speech-to-Text**: Convert spoken language to text in real-time
- **Machine Translation**: Translate text between multiple languages
- **Text-to-Speech**: Read text aloud in different languages

We prioritize accuracy in academic contexts — classroom terms, project instructions, and formal conversations are treated with contextual care.

## Features

### Language Support

Harmony supports the following languages:
- English
- Spanish (Español)
- Chinese (中文)
- French (Français)
- German (Deutsch)
- Japanese (日本語)
- Korean (한국어)
- Vietnamese (Tiếng Việt)
- Arabic (العربية)
- Hindi (हिन्दी)

### Academic Context Awareness

Harmony includes a built-in glossary of academic terminology to ensure accurate translation and recognition of:
- Classroom terms (syllabus, lecture, exam, etc.)
- Research terminology (thesis, dissertation, peer review, etc.)
- Campus life terms (dormitory, cafeteria, registrar, etc.)
- Administrative terms (financial aid, scholarship, tuition, etc.)

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
import Harmony from 'harmony';

// Create a new Harmony instance
const harmony = new Harmony();

// Initialize services
harmony.initialize();

// Translate text
const result = await harmony.translate('Hello, welcome to class!', 'es');
console.log(result.translatedText);

// Speak text
await harmony.speak('Welcome to Boise State University', 'en');
```

### Advanced Usage

```javascript
// Real-time translation
harmony.startRealTimeTranslation('es', (translation) => {
  console.log('Translated:', translation.translatedText);
}, (error) => {
  console.error('Error:', error);
});

// Stop real-time translation
harmony.stopRealTimeTranslation();
```

### Individual Services

```javascript
import { 
  SpeechToTextService, 
  TranslationService, 
  TextToSpeechService 
} from 'harmony';

// Speech-to-Text
const stt = new SpeechToTextService({ language: 'en' });
stt.initialize();
stt.startListening((results) => {
  console.log('Heard:', results[0].transcript);
});

// Translation
const translator = new TranslationService();
const result = await translator.translate('Hello', {
  sourceLanguage: 'en',
  targetLanguage: 'es'
});

// Text-to-Speech
const tts = new TextToSpeechService({ language: 'en' });
tts.initialize();
await tts.speak('Hello, world!');
```

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Configuration

Academic context settings can be customized by importing the configuration:

```javascript
import { academicContextConfig } from 'harmony';

// View supported languages
console.log(academicContextConfig.supportedLanguages);

// View text-to-speech settings
console.log(academicContextConfig.textToSpeech);
```

## API Reference

### Harmony Class

| Method | Description |
|--------|-------------|
| `initialize()` | Initialize all services |
| `setLanguage(code)` | Set the current language |
| `getSupportedLanguages()` | Get list of supported languages |
| `translate(text, targetLang, sourceLang?)` | Translate text |
| `speak(text, language?)` | Speak text aloud |
| `startListening(onResult, onError)` | Start speech recognition |
| `stopListening()` | Stop speech recognition |
| `translateAndSpeak(text, targetLang)` | Translate and speak |
| `startRealTimeTranslation(targetLang, onTranslation, onError)` | Start real-time translation |
| `stopRealTimeTranslation()` | Stop real-time translation |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## About

Harmony is developed at Boise State University to foster an inclusive learning environment for students from diverse linguistic backgrounds.