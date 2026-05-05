import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface Message {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  onRefresh: () => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onRefresh, onToast }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const toggleRead = async (id: string, current: boolean) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('messages').update({ is_read: !current }).eq('id', id);
      onRefresh();
    } catch (err: any) {
      onToast('error', err.message);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('messages').delete().eq('id', id);
      onToast('success', 'Message supprimé !');
      onRefresh();
    } catch (err: any) {
      onToast('error', err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const subjectLabels: Record<string, string> = {
    freelance: 'Mission freelance',
    growtech: 'Collaboration GROW TECH',
    other: 'Autre',
  };

  return (
    <div className="space-y-4">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-display font-bold text-white">Messages ({messages.length})</h2>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === f
                  ? 'bg-[#00BFFF] text-black font-semibold'
                  : 'text-[#A8B4C8] hover:text-white bg-[#141430]'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'unread' ? 'Non lus' : 'Lus'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="glass-card text-center py-12">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-[#A8B4C8]">Aucun message pour l'instant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`glass-card border transition-all cursor-pointer ${
                    !msg.is_read ? 'border-l-4 border-l-[#00BFFF]' : 'border-[rgba(0,191,255,0.15)]'
                  } ${isExpanded ? 'border-[#00BFFF]' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.is_read && <span className="w-2 h-2 bg-[#00BFFF] rounded-full" />}
                        <h4 className="text-white font-semibold truncate">{msg.full_name}</h4>
                        <span className="text-[#4A5568] text-xs">{msg.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-[#141430] text-[#00BFFF] text-xs rounded">
                          {subjectLabels[msg.subject] || msg.subject}
                        </span>
                        <span className="text-[#4A5568] text-xs">{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="text-[#A8B4C8] text-sm truncate">{msg.message.substring(0, 100)}...</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleRead(msg.id, msg.is_read)} className="p-2 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" title={msg.is_read ? 'Marquer non lu' : 'Marquer lu'}>
                        {msg.is_read ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        )}
                      </button>
                      <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="p-2 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" title="Répondre">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </a>
                      <button onClick={() => deleteMessage(msg.id)} className="p-2 text-[#A8B4C8] hover:text-red-400 transition-colors" title="Supprimer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-[rgba(0,191,255,0.15)]">
                          <p className="text-[#A8B4C8] text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-2">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              Répondre
                            </a>
                            <a href={`https://wa.me/${msg.email.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#A8B4C8] hover:text-green-400 text-xs transition-colors">
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MessageList;