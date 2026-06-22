import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';
import ConfirmDialog from './ConfirmDialog';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AdminDashboard from './AdminDashboard';
import AdminContent from './AdminContent';
import AdminTestimonials from './AdminTestimonials';
import AdminBlog from './AdminBlog';
import AdminGrowTech from './AdminGrowTech';
import AdminVision from './AdminVision';
import AdminProjectsNew from './AdminProjectsNew';
import AdminSkills from './AdminSkills';
import GlobalLoadingIndicator from './GlobalLoadingIndicator';
import MessageList from './MessageList';

// Import centralisé des types (P2 Refactor)
import {
  Project,
  Message,
  Testimonial,
  DashboardData,
} from '../types';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
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

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: 'danger' | 'warning' | 'info' = 'danger'
  ) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, type });
  };

  const closeConfirm = () => setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/projects')) return { title: 'Projets', breadcrumb: ['Projets'] };
    if (path.includes('/testimonials')) return { title: 'Témoignages', breadcrumb: ['Témoignages'] };
    if (path.includes('/skills')) return { title: 'Compétences', breadcrumb: ['Compétences'] };
    if (path.includes('/messages')) return { title: 'Messages', breadcrumb: ['Messages'] };
    if (path.includes('/content')) return { title: 'Contenu', breadcrumb: ['Contenu'] };
    if (path.includes('/blog')) return { title: 'Blog', breadcrumb: ['Blog'] };
    if (path.includes('/growtech')) return { title: 'GROW TECH', breadcrumb: ['GROW TECH'] };
    if (path.includes('/vision')) return { title: 'Vision', breadcrumb: ['Vision'] };
    return { title: "Vue d'ensemble", breadcrumb: [] };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <div className="min-h-screen bg-[#0A0A1E] flex">
      <GlobalLoadingIndicator isLoading={loading} />
      <Sidebar
        unreadCount={dashboardData.unreadMessages}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          breadcrumb={breadcrumb}
          unreadCount={dashboardData.unreadMessages}
          onMobileMenuClick={() => setIsMobileOpen(true)}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6" role="main">
          <Routes>
            <Route index element={<AdminDashboard data={dashboardData} loading={loading} onToast={addToast} />} />
            <Route path="dashboard" element={<AdminDashboard data={dashboardData} loading={loading} onToast={addToast} />} />
            <Route path="projects" element={<AdminProjectsNew onToast={addToast} />} />
            <Route
              path="testimonials"
              element={
                <AdminTestimonials
                  testimonials={testimonials}
                  onRefresh={fetchDashboard}
                  onToast={addToast}
                  onConfirmDelete={(name: string, onDone: () => void) =>
                    showConfirm(
                      'Supprimer le témoignage',
                      `Êtes-vous sûr de vouloir supprimer le témoignage de "${name}" ?`,
                      onDone,
                      'danger'
                    )
                  }
                />
              }
            />
            <Route
              path="messages"
              element={<MessageList messages={messages} onRefresh={fetchDashboard} onToast={addToast} />}
            />
            <Route path="content" element={<AdminContent />} />
            <Route path="skills" element={<AdminSkills onToast={addToast} />} />
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

export default AdminLayout;