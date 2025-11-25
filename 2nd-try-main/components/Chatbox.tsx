
import React, { useState } from 'react';

interface ChatboxProps {
  onTranslate: (text: string) => void;
  isLoading: boolean;
}

const Chatbox: React.FC<ChatboxProps> = ({ onTranslate, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onTranslate(text);
      setText('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-purple-900 mb-2">Or type to translate...</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="flex-grow p-3 border border-purple-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed"
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? '...' : 'Translate'}
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
