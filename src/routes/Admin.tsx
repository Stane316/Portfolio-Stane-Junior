import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from '../admin/hooks/useToast';
import { ToastContainer } from '../admin/components/Toast';
import Sidebar from '../admin/components/Sidebar';
import Topbar from '../admin/components/Topbar';
import AdminDashboard from '../admin/components/AdminDashboard';
import ProjectTable from '../admin/components/ProjectTable';
import MessageList from '../admin/components/MessageList';
import AdminContent from '../admin/components/AdminContent';
import AdminTestimonials from '../admin/components/AdminTestimonials';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 glass rounded-2xl flex items-center justify-center mb-4">
            <span className="font-heading text-3xl text-white">SJ</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Administration</h1>
        </div>
        <form onSubmit={handleLogin} className="glass-card space-y-6">
          {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">{error}</div>}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 glass rounded-lg border border-[rgba(0,191,255,0.15)] bg-[#141430] text-white focus:outline-none focus:border-[#00BFFF]" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 glass rounded-lg border border-[rgba(0,191,255,0.15)] bg-[#141430] text-white focus:outline-none focus:border-[#00BFFF]" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Connexion...' : 'Se connecter'}</button>
        </form>
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    projects: 0,
    testimonials: 0,
    messages: 0,
    unreadMessages: 0,
    recentMessages: [],
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  const fetchDashboard = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    try {
      const [pRes, tRes, mRes] = await Promise.all([
        supabase.from('projects').select('*').order('display_order').limit(3),
        supabase.from('testimonials').select('*').eq('is_visible', true),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
      ]);

      const projectsData = pRes.data || [];
      const messagesData = mRes.data || [];
      const unread = messagesData.filter((m: any) => !m.is_read).length;

      setDashboardData({
        projects: projectsData.length,
        testimonials: (tRes.data || []).length,
        messages: messagesData.length,
        unreadMessages: unread,
        recentMessages: messagesData.slice(0, 5),
        recentProjects: projectsData,
      });
      setProjects(projectsData);
      setMessages(messagesData);
      setTestimonials(tRes.data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/projects')) return { title: 'Projets', breadcrumb: ['Projets'] };
    if (path.includes('/testimonials')) return { title: 'Témoignages', breadcrumb: ['Témoignages'] };
    if (path.includes('/messages')) return { title: 'Messages', breadcrumb: ['Messages'] };
    if (path.includes('/content')) return { title: 'Contenu', breadcrumb: ['Contenu'] };
    return { title: 'Vue d\'ensemble', breadcrumb: [] };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <div className="min-h-screen bg-[#0A0A1E] flex">
      <Sidebar unreadCount={dashboardData.unreadMessages} onLogout={handleLogout} isMobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} breadcrumb={breadcrumb} unreadCount={dashboardData.unreadMessages} onMobileMenuClick={() => setIsMobileOpen(true)} onLogout={handleLogout} />
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Routes>
            <Route index element={<AdminDashboard data={dashboardData} loading={loading} onToast={addToast} />} />
            <Route path="dashboard" element={<AdminDashboard data={dashboardData} loading={loading} onToast={addToast} />} />
            <Route path="projects" element={<ProjectTable projects={projects} onRefresh={fetchDashboard} onToast={addToast} />} />
            <Route path="testimonials" element={<AdminTestimonials testimonials={testimonials} onRefresh={fetchDashboard} onToast={addToast} />} />
            <Route path="messages" element={<MessageList messages={messages} onRefresh={fetchDashboard} onToast={addToast} />} />
            <Route path="content" element={<AdminContent />} />
          </Routes>
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

const Admin: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
};

export default Admin;