import React from 'react';
import Translator from './Translator';

const Home: React.FC = () => (
  <div>
    <div className="bg-purple-100 py-16 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-900">Harmony — Connecting Voices, Bridging Languages</h1>
      <p className="mt-4 text-lg md:text-xl text-purple-700 max-w-3xl mx-auto">
        Real-time speech-to-speech translation for students and campus life. Supports 12+ languages, offline mode, and classroom-aware translations.
      </p>
      <div className="mt-8">
        <button 
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={() => document.getElementById('translator-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Try the Translator
        </button>
      </div>
    </div>
    <div className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center text-purple-900 mb-8">Key Features</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800">Speech-to-Speech Translation</h3>
                <p className="mt-2 text-purple-700">Hold-to-speak voice input provides instant translated voice output.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800">Offline & Online Modes</h3>
                <p className="mt-2 text-purple-700">Translate on the go, even without an internet connection.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800">History & Learning</h3>
                <p className="mt-2 text-purple-700">Review your translation history and get suggestions for new words to learn.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800">Chatbox for Typed Input</h3>
                <p className="mt-2 text-purple-700">Type messages that are hard to pronounce and hear them spoken aloud.</p>
            </div>
        </div>
    </div>
    <div id="translator-section" className="pt-8">
      <Translator />
    </div>
  </div>
);

export default Home;
