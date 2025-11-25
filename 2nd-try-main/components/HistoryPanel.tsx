import React from 'react';
import type { TranslationEntry } from '../types';
import PlayIcon from './icons/PlayIcon';

interface HistoryPanelProps {
  history: TranslationEntry[];
  onReplay: (text: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onReplay }) => {
  if (history.length === 0) {
    return (
      <div className="p-4 bg-purple-100 rounded-lg text-center text-purple-700">
        <p>Your translation history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {history.map((entry) => (
          <li key={entry.id} className="p-4 bg-white rounded-lg shadow-sm border border-purple-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{entry.sourceLang} → {entry.targetLang}</p>
                <p className="mt-1 font-medium text-purple-900">{entry.sourceText}</p>
                <p className="mt-2 text-purple-700">{entry.translatedText}</p>
              </div>
              <button
                onClick={() => onReplay(entry.translatedText)}
                className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full transition-colors"
                aria-label="Replay translation audio"
              >
                <PlayIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-right text-xs text-gray-400 mt-2">
              {entry.timestamp.toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;