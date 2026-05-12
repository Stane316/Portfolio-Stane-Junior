import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from '../admin/hooks/useToast';
import { ToastContainer } from '../admin/components/Toast';
import ConfirmDialog from '../admin/components/ConfirmDialog';
import ProtectedRoute from '../admin/components/ProtectedRoute';
import Sidebar from '../admin/components/Sidebar';
import Topbar from '../admin/components/Topbar';
import AdminDashboard from '../admin/components/AdminDashboard';
import ProjectTable from '../admin/components/ProjectTable';
import MessageList from '../admin/components/MessageList';
import AdminContent from '../admin/components/AdminContent';
import AdminTestimonials from '../admin/components/AdminTestimonials';
import AdminBlog from '../admin/components/AdminBlog';
import AdminGrowTech from '../admin/components/AdminGrowTech';
import AdminVision from '../admin/components/AdminVision';
import AdminProjectsNew from '../admin/components/AdminProjectsNew';
import GlobalLoadingIndicator from '../admin/components/GlobalLoadingIndicator';

// ... [Tes interfaces Project, Message, etc. restent ici] ...
interface Project {
  id: string;
  title_fr: string;
  title_en: string;
  status: 'delivered' | 'in_progress' | 'concept';
  description_fr: string;
  description_en: string;
  stack: string[];
  live_url: string;
  image_url: string;
  case_study_fr: Record<string, { title: string; content: string }>;
  case_study_en: Record<string, { title: string; content: string }>;
  display_order: number;
  is_visible: boolean;
  is_featured: boolean;
  created_at: string;
}

interface Message {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Testimonial {
  id: string;
  person_name: string;
  person_role: string;
  company: string;
  content_fr: string;
  content_en: string;
  photo_url: string;
  video_url: string;
  is_visible: boolean;
  display_order: number;
  created_at: string;
}

interface DashboardData {
  projects: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
  recentMessages: Message[];
  recentProjects: Project[];
}

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Sécurité inverse : Si on est déjà connecté, on redirige vers le dashboard
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin/dashboard', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Identifiants incorrects';
      setError(message);
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
          {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400" role="alert">{error}</div>}
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold mb-2 text-white">Email</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 glass rounded-lg border border-[rgba(0,191,255,0.15)] bg-[#141430] text-white focus:outline-none focus:border-[#00BFFF]" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold mb-2 text-white">Mot de passe</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 glass rounded-lg border border-[rgba(0,191,255,0.15)] bg-[#141430] text-white focus:outline-none focus:border-[#00BFFF]" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger',
  });
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    projects: 0,
    testimonials: 0,
    messages: 0,
    unreadMessages: 0,
    recentMessages: [],
    recentProjects: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const fetchDashboard = async (): Promise<void> => {
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

      const projectsData: Project[] = (pRes.data as Project[]) || [];
      const messagesData: Message[] = (mRes.data as Message[]) || [];
      const unread = messagesData.filter((m: Message) => !m.is_read).length;

      setDashboardData({
        projects: projectsData.length,
        testimonials: (tRes.data as Testimonial[] || []).length,
        messages: messagesData.length,
        unreadMessages: unread,
        recentMessages: messagesData.slice(0, 5),
        recentProjects: projectsData,
      });
      setProjects(projectsData);
      setMessages(messagesData);
      setTestimonials((tRes.data as Testimonial[]) || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'danger'): void => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, type });
  };

  const closeConfirm = (): void => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const getPageInfo = (): { title: string; breadcrumb: string[] } => {
    const path = location.pathname;
    if (path.includes('/projects')) return { title: 'Projets', breadcrumb: ['Projets'] };
    if (path.includes('/testimonials')) return { title: 'Témoignages', breadcrumb: ['Témoignages'] };
    if (path.includes('/messages')) return { title: 'Messages', breadcrumb: ['Messages'] };
    if (path.includes('/content')) return { title: 'Contenu', breadcrumb: ['Contenu'] };
    if (path.includes('/blog')) return { title: 'Blog', breadcrumb: ['Blog'] };
    if (path.includes('/growtech')) return { title: 'GROW TECH', breadcrumb: ['GROW TECH'] };
    if (path.includes('/vision')) return { title: 'Vision', breadcrumb: ['Vision'] };
    return { title: 'Vue d\'ensemble', breadcrumb: [] };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
  <div className="min-h-screen bg-[#0A0A1E] flex">
    {/* Loading Global */}
    <GlobalLoadingIndicator isLoading={loading} />
    
    <Sidebar unreadCount={dashboardData.unreadMessages} onLogout={handleLogout} isMobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} />
    
    <main className="flex-1 flex flex-col min-w-0">
      <Topbar title={title} breadcrumb={breadcrumb} unreadCount={dashboardData.unreadMessages} onMobileMenuClick={() => setIsMobileOpen(true)} onLogout={handleLogout} />
      
      <div className="flex-1 overflow-y-auto p-4 lg:p-6" role="main">
        <Routes>
          <Route index element={<AdminDashboard data={dashboardData} loading={loading} onToast={addToast} />} />
          <Route path="dashboard" element={<AdminDashboard data={dashboardData} loading={loading} onToast={addToast} />} />
          <Route path="projects" element={<AdminProjectsNew onToast={addToast} />} />
          <Route path="testimonials" element={<AdminTestimonials testimonials={testimonials} onRefresh={fetchDashboard} onToast={addToast} onConfirmDelete={(name: string, onDone: () => void) => showConfirm('Supprimer le témoignage', `Êtes-vous sûr de vouloir supprimer le témoignage de "${name}" ?`, onDone, 'danger')} />} />
          <Route path="messages" element={<MessageList messages={messages} onRefresh={fetchDashboard} onToast={addToast} />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="blog" element={<AdminBlog onToast={addToast} />} />
          <Route path="growtech" element={<AdminGrowTech onToast={addToast} />} />
          <Route path="vision" element={<AdminVision onToast={addToast} />} />
        </Routes>
      </div>
    </main>

    <ToastContainer toasts={toasts} onRemove={removeToast} />
    <ConfirmDialog
      isOpen={confirmDialog.isOpen}
      title={confirmDialog.title}
      message={confirmDialog.message}
      onConfirm={() => {
        confirmDialog.onConfirm();
        closeConfirm();
      }}
      onCancel={closeConfirm}
      type={confirmDialog.type}
    />
  </div>
);
};

const Admin: React.FC = () => {
  return (
    <Routes>
      {/* Login publique (mais vérifie si déjà connecté) */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Toutes les autres routes sont strictement protégées */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default Admin;