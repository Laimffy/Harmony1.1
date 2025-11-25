import React, { useState, useEffect, useCallback } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { translateText, speakText } from '../services/geminiService';
import LanguageSelector from './LanguageSelector';
import MicrophoneIcon from './icons/MicrophoneIcon';
import HistoryPanel from './HistoryPanel';
import Chatbox from './Chatbox';
import type { TranslationEntry } from '../types';

const Translator: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TranslationEntry[]>([]);

  const { isListening, transcript, error: sttError, isSupported, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (sttError) setError(sttError);
  }, [sttError]);
  
  const handleTranslation = useCallback(async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;

    setError(null);
    setIsLoading(true);
    setSourceText(textToTranslate);
    setTranslatedText('Translating...');

    try {
      const translation = await translateText(textToTranslate, sourceLang, targetLang);
      setTranslatedText(translation);
      
      const newEntry: TranslationEntry = {
        id: new Date().toISOString(),
        sourceText: textToTranslate,
        translatedText: translation,
        sourceLang,
        targetLang,
        timestamp: new Date(),
      };
      setHistory(prev => [newEntry, ...prev]);

      // Speak the translation using browser TTS
      speakText(translation, targetLang);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setTranslatedText('');
    } finally {
      setIsLoading(false);
    }
  }, [sourceLang, targetLang]);

  useEffect(() => {
    if (!isListening && transcript) {
      handleTranslation(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const handleHold = () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }
    startListening(sourceLang);
  };

  const handleRelease = () => {
    stopListening();
  };

  const handleReplay = (text: string, lang: string = targetLang) => {
    speakText(text, lang);
  };

  const handleClearHistory = () => {
    setHistory([]);
    // Optional: Call backend to clear server-side history for the logged-in user
    /*
    fetch('/api/history', { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('harmony-token')}`
      } 
    }).catch(err => console.error("Failed to clear history on server:", err));
    */
    console.log("History cleared locally.");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-full grid grid-cols-2 gap-4">
            <LanguageSelector id="source-lang" label="From" value={sourceLang} onChange={setSourceLang} />
            <LanguageSelector id="target-lang" label="To" value={targetLang} onChange={setTargetLang} />
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <button
              onMouseDown={handleHold}
              onMouseUp={handleRelease}
              onTouchStart={handleHold}
              onTouchEnd={handleRelease}
              className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out
                ${isListening 
                  ? 'bg-purple-700 text-white shadow-lg scale-110' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'}
                focus:outline-none focus:ring-4 focus:ring-purple-300`}
              aria-label="Hold to talk"
            >
              <MicrophoneIcon className="w-16 h-16" />
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-white opacity-75 animate-ping"></div>
              )}
            </button>
            <p className="text-purple-800 text-center">
              {isListening ? "Listening..." : "Hold to talk"}
            </p>
          </div>

          <div className="w-full p-4 bg-white rounded-lg shadow-sm border border-purple-200 min-h-[120px]">
            <p className="text-sm text-gray-500">You said:</p>
            <p className="mt-1 text-purple-900">{sourceText || "..."}</p>
          </div>

          <div className="w-full p-4 bg-purple-100 rounded-lg shadow-sm border border-purple-200 min-h-[120px]">
            <p className="text-sm text-purple-700">Translation:</p>
            <p className="mt-1 font-semibold text-purple-900">{isLoading && translatedText ? '...' : translatedText || '...'}</p>
          </div>
          
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!isSupported && <p className="text-yellow-600 bg-yellow-100 p-2 rounded-md text-center">Your browser does not support speech recognition.</p>}
        </div>

        <div className="p-4 bg-purple-50/50 rounded-lg">
           <div className="flex justify-between items-center mb-3">
             <h3 className="text-lg font-semibold text-purple-900">History</h3>
              {history.length > 0 && (
                <button 
                  onClick={handleClearHistory}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Clear History
                </button>
              )}
          </div>
          <HistoryPanel history={history} onReplay={handleReplay} />
          <Chatbox onTranslate={handleTranslation} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Translator;