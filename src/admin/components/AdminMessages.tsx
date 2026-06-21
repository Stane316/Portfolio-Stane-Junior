/**
 * Admin Messages Component
 * 
 * View and manage contact form messages.
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, current: boolean) => {
    try {
      await supabase.from('messages').update({ is_read: !current }).eq('id', id);
      fetchMessages();
    } catch (err: any) {
      console.error('Error updating message:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm(isFr ? 'Supprimer ce message ?' : 'Delete this message?')) return;

    try {
      await supabase.from('messages').delete().eq('id', id);
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err: any) {
      console.error('Error deleting message:', err);
    }
  };

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      freelance: isFr ? 'Mission freelance' : 'Freelance',
      growtech: isFr ? 'Collaboration GROW TECH' : 'GROW TECH',
      other: isFr ? 'Autre' : 'Other',
    };
    return labels[subject] || subject;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">
          {isFr ? 'Messages reçus' : 'Messages Received'}
        </h2>
        <span className="px-3 py-1 bg-[var(--accent-cyan)] text-black font-semibold rounded-full">
          {messages.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="glass-card text-center py-12">
              <p className="text-[var(--text-secondary)]">{isFr ? 'Aucun message' : 'No messages'}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read) markAsRead(message.id, message.is_read);
                }}
                className={`glass-card p-4 cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)] bg-opacity-10'
                    : !message.is_read
                    ? 'border-l-4 border-l-[var(--accent-cyan)]'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold text-sm">{message.full_name}</h4>
                  {!message.is_read && <span className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full" />}
                </div>
                <p className="text-[var(--text-secondary)] text-xs mb-1">{message.email}</p>
                <span className="inline-block px-2 py-0.5 bg-[var(--bg-card)] text-[var(--accent-cyan)] text-xs rounded">
                  {getSubjectLabel(message.subject)}
                </span>
                <p className="text-[var(--text-muted)] text-xs mt-2 truncate">
                  {message.message.substring(0, 50)}...
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[var(--text-muted)] text-xs">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                    className="p-1 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                    aria-label={isFr ? 'Supprimer' : 'Delete'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="glass-card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{selectedMessage.full_name}</h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[var(--accent-cyan)] text-sm"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[var(--bg-card)] text-[var(--accent-cyan)] text-sm rounded-full">
                    {getSubjectLabel(selectedMessage.subject)}
                  </span>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                    aria-label={isFr ? 'Supprimer' : 'Delete'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-card)] rounded-lg mb-4">
                <p className="text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] text-sm">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${getSubjectLabel(selectedMessage.subject)}`}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {isFr ? 'Répondre' : 'Reply'}
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)]">
                  {isFr ? 'Sélectionnez un message' : 'Select a message'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
