import React from 'react';

const developers = [
    { name: 'AFABLE, AICELLE AIS', role: 'Team Leader' },
    { name: 'BALLESTEROS, JOHN MEYNARD', role: 'UI/UX Designer' },
    { name: 'DUDAS, JAELA ROVIC G.', role: 'Programmer' },
    { name: 'HKAWNG ZAM JAP', role: 'Programmer' }
];

const About: React.FC = () => (
  <div className="max-w-4xl mx-auto p-8">
    <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200">
      <h1 className="text-4xl font-bold text-purple-900 mb-6 text-center">About Harmony</h1>
      <div className="space-y-4 text-lg text-purple-800 mb-12">
        <p>
          Harmony is a student-centered app developed at BSU to promote language inclusivity and better communication across our diverse campus. 
          Using speech-to-text, machine translation, and text-to-speech technology, Harmony helps learners and visitors speak, understand, and participate in classroom and campus life.
        </p>
        <p>
          We prioritize accuracy in academic contexts — classroom terms, project instructions, and formal conversations are treated with contextual care.
        </p>
      </div>
       <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">The Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {developers.map((dev, index) => (
          <div key={index} className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800">{dev.name}</h3>
            <p className="text-sm text-purple-600">{dev.role}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default About;