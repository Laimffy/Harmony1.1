import React, { useState } from 'react';
import { contactAPI } from '../services/apiService';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'urgent', label: 'Urgent Issue' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await contactAPI.sendMessage(
        formData.name,
        formData.email,
        formData.subject,
        formData.message,
        formData.category,
        formData.priority
      );

      setSuccess('Thank you for your message! We will get back to you shortly.');
      setFormData({ name: '', email: '', category: 'general', subject: '', message: '', priority: 'medium' });
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200">
        <h1 className="text-4xl font-bold text-purple-900 mb-6 text-center">Contact Harmony Team</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 text-purple-800">
            <div>
              <h2 className="text-xl font-semibold">Email</h2>
              <a href="mailto:support@harmony.bsu.edu" className="text-purple-600 hover:underline">support@harmony.bsu.edu</a>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Office</h2>
              <p>Computer Engineering Department, Batangas State University</p>
            </div>
            <p className="pt-4 text-sm text-purple-600">We reply within 48 hours. For urgent campus accessibility issues contact campus security.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-sm">{error}</p>}
            {success && <p className="text-green-500 bg-green-100 p-3 rounded-md text-sm">{success}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-800">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-800">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-purple-800">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-purple-800">Priority</label>
                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                  {priorities.map(pri => (
                    <option key={pri.value} value={pri.value}>{pri.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-purple-800">Subject</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-purple-800">Message</label>
              <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"></textarea>
            </div>
            <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300">
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;