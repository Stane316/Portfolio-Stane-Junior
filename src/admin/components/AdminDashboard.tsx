import React from 'react';
import KPICard from './KPICard';
import EmptyState from './EmptyState';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface DashboardData {
  projects: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
  recentMessages: any[];
  recentProjects: any[];
}

interface AdminDashboardProps {
  data: DashboardData;
  loading: boolean;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, loading, onToast }) => {
  const markAsRead = async (id: string) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('messages').update({ is_read: true }).eq('id', id);
    } catch (err: any) {
      onToast('error', err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[rgba(0,191,255,0.15)] bg-[#141430] p-5 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A3E] mb-3" />
              <div className="w-16 h-8 bg-[#1A1A3E] rounded mb-2" />
              <div className="w-24 h-4 bg-[#1A1A3E] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="📁" value={data.projects} label="Projets publiés" color="cyan" delay={0} />
        <KPICard icon="💬" value={data.testimonials} label="Témoignages actifs" color="blue" delay={0.1} />
        <KPICard icon="📧" value={data.messages} label="Messages reçus" color="green" delay={0.2} />
        <KPICard icon="🔔" value={data.unreadMessages} label="Messages non lus" color={data.unreadMessages > 0 ? 'red' : 'yellow'} delay={0.3} />
      </div>

      {/* Recent Messages */}
      <div className="glass-card border border-[rgba(0,191,255,0.15)]">
        <h3 className="text-lg font-display font-bold text-white mb-4">Derniers messages</h3>
        {data.recentMessages.length === 0 ? (
          <EmptyState
            icon="📭"
            title="Aucun message"
            description="Votre portfolio est en ligne et prêt à recevoir des contacts."
          />
        ) : (
          <div className="space-y-3">
            {data.recentMessages.map((msg: any) => (
              <div key={msg.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${!msg.is_read ? 'bg-[#00BFFF] bg-opacity-5 border border-[rgba(0,191,255,0.15)]' : 'hover:bg-[#141430]'}`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{msg.full_name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white text-sm font-medium truncate">{msg.full_name}</p>
                    {!msg.is_read && <span className="w-2 h-2 bg-[#00BFFF] rounded-full flex-shrink-0" />}
                    <span className="text-[#4A5568] text-xs">{new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-[#A8B4C8] text-xs truncate">{msg.message.substring(0, 80)}...</p>
                </div>
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)} className="text-[#00BFFF] text-xs hover:underline flex-shrink-0">
                    Marquer lu
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Projects */}
      <div className="glass-card border border-[rgba(0,191,255,0.15)]">
        <h3 className="text-lg font-display font-bold text-white mb-4">Derniers projets</h3>
        {data.recentProjects.length === 0 ? (
          <EmptyState
            icon="📁"
            title="Aucun projet"
            description="Commencez par créer votre premier projet."
          />
        ) : (
          <div className="space-y-3">
            {data.recentProjects.map((project: any) => {
              const statusColors = { delivered: 'bg-green-500', in_progress: 'bg-yellow-500', concept: 'bg-blue-500' };
              const statusLabels = { delivered: 'Livré', in_progress: 'En cours', concept: 'Concept' };
              return (
                <div key={project.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#141430] transition-colors">
                  <div className={`w-3 h-3 rounded-full ${statusColors[project.status as keyof typeof statusColors]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{project.title_fr}</p>
                    <p className="text-[#4A5568] text-xs">{project.title_en}</p>
                  </div>
                  <span className="text-[#A8B4C8] text-xs">{statusLabels[project.status as keyof typeof statusLabels]}</span>
                  <span className="text-[#4A5568] text-xs font-mono">#{project.display_order}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;