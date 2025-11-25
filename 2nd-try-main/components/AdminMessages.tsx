import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/apiService';
import type { ContactMessage } from '../types';

interface AdminMessagesProps {
  userEmail: string;
}

interface Reply {
  id: number;
  admin_name: string;
  reply_text: string;
  created_at: string;
}

const AdminMessages: React.FC<AdminMessagesProps> = ({ userEmail }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'resolved' | 'in-progress'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);
  const [replies, setReplies] = useState<{ [key: number]: Reply[] }>({});
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [isReplying, setIsReplying] = useState<{ [key: number]: boolean }>({});

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'urgent', label: 'Urgent Issue' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  useEffect(() => {
    fetchMessages();
  }, [filter, categoryFilter, priorityFilter, searchTerm]);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = filter === 'all' ? undefined : filter;
      const category = categoryFilter === 'all' ? undefined : categoryFilter;
      const priority = priorityFilter === 'all' ? undefined : priorityFilter;
      const data = await contactAPI.getMessages(100, status, category, priority, searchTerm);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReplies = async (messageId: number) => {
    try {
      const data = await contactAPI.getReplies(messageId);
      setReplies(prev => ({
        ...prev,
        [messageId]: data.replies || []
      }));
    } catch (err) {
      console.error('Failed to fetch replies:', err);
    }
  };

  const updateMessageStatus = async (messageId: number, newStatus: 'new' | 'read' | 'in-progress' | 'resolved') => {
    try {
      await contactAPI.updateMessageStatus(messageId, newStatus);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const addReply = async (messageId: number) => {
    if (!replyText[messageId]?.trim()) return;
    
    setIsReplying(prev => ({ ...prev, [messageId]: true }));
    try {
      await contactAPI.addReply(messageId, replyText[messageId], 'Admin');
      setReplyText(prev => ({ ...prev, [messageId]: '' }));
      
      // Refresh replies and mark message as in-progress
      fetchReplies(messageId);
      updateMessageStatus(messageId, 'in-progress');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reply');
    } finally {
      setIsReplying(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const toggleMessageExpanded = (messageId: number) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    if (expandedMessage !== messageId && !replies[messageId]) {
      fetchReplies(messageId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'bug': 'bg-red-100 text-red-800',
      'feature': 'bg-blue-100 text-blue-800',
      'general': 'bg-gray-100 text-gray-800',
      'urgent': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md border border-purple-200">
        <div className="p-6 border-b border-purple-200">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Contact Messages</h1>
          <p className="text-purple-700">View and manage messages from your website visitors</p>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-purple-200">
          <input
            type="text"
            placeholder="Search messages by name, email, subject, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="p-6 border-b border-purple-200 space-y-4">
          <div>
            <label className="text-sm font-medium text-purple-800 block mb-2">Status</label>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'new', 'read', 'in-progress', 'resolved'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-800 block mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-800 block mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                {priorities.map(pri => (
                  <option key={pri.value} value={pri.value}>{pri.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="p-6">
          {error && (
            <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>
          )}

          {isLoading ? (
            <p className="text-center text-purple-700 py-8">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-purple-700 py-8">No messages found</p>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className="border border-purple-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    onClick={() => toggleMessageExpanded(message.id)}
                    className="p-4 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-900">
                          {message.subject}
                        </h3>
                        <p className="text-sm text-purple-600 mt-1">
                          From: <span className="font-medium">{message.name}</span> ({message.email})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getCategoryColor(message.category)}`}>
                          {message.category}
                        </span>
                        <span className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedMessage === message.id && (
                    <div className="p-4 bg-white border-t border-purple-200 space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">Message</h4>
                        <p className="text-purple-800 whitespace-pre-wrap">{message.message}</p>
                      </div>

                      {/* Replies Section */}
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">Replies ({replies[message.id]?.length || 0})</h4>
                        <div className="space-y-3 mb-4">
                          {replies[message.id]?.map((reply, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-700">{reply.admin_name}</p>
                              <p className="text-xs text-gray-500 mb-1">{formatDate(reply.created_at)}</p>
                              <p className="text-gray-800">{reply.reply_text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Reply Input */}
                        <div className="flex gap-2">
                          <textarea
                            value={replyText[message.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [message.id]: e.target.value }))}
                            placeholder="Add a reply..."
                            className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                            rows={2}
                          />
                          <button
                            onClick={() => addReply(message.id)}
                            disabled={isReplying[message.id] || !replyText[message.id]?.trim()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 font-medium text-sm whitespace-nowrap"
                          >
                            {isReplying[message.id] ? 'Sending...' : 'Send Reply'}
                          </button>
                        </div>
                      </div>

                      {/* Status Update Buttons */}
                      <div className="pt-4 border-t border-purple-200">
                        <p className="text-sm font-medium text-purple-800 mb-2">Update Status:</p>
                        <div className="flex gap-2 flex-wrap">
                          {(['new', 'read', 'in-progress', 'resolved'] as const).map(status => (
                            <button
                              key={status}
                              onClick={() => updateMessageStatus(message.id, status)}
                              disabled={message.status === status}
                              className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                                message.status === status
                                  ? 'bg-purple-200 text-purple-800 cursor-default'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:bg-purple-300'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-purple-200 text-sm text-purple-600">
          Total messages: {messages.length}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
