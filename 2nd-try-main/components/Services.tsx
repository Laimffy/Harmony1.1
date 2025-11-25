import React from 'react';

const services = [
  { title: "Real-time Speech-to-Speech Translation", description: "Hold the record button to translate voice instantly." },
  { title: "Offline Translation", description: "Translate basic phrases without an internet connection." },
  { title: "Translation History", description: "Save, export, and replay previous translations." },
  { title: "Language Learning Suggestions", description: "Daily vocabulary and phrase suggestions tailored to the user’s translation history." },
  { title: "Chatbox", description: "Type messages that are hard to pronounce and have them spoken aloud in the target language." },
  { title: "Profile & Privacy", description: "Personal translation preferences, saved histories, and privacy controls." },
];

const Services: React.FC = () => (
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-4xl font-bold text-purple-900 mb-8 text-center">Our Services</h1>
    <div className="grid md:grid-cols-2 gap-6">
      {services.map((service, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-purple-200">
          <h2 className="text-2xl font-semibold text-purple-800">{service.title}</h2>
          <p className="mt-2 text-purple-700">{service.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Services;
