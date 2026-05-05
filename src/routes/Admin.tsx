/**
 * Admin Route Component - CRUD Complete
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from '../admin/components/AdminLayout';
import AdminProjects from '../admin/components/AdminProjects';
import AdminTestimonials from '../admin/components/AdminTestimonials';
import AdminMessages from '../admin/components/AdminMessages';
import AdminContent from '../admin/components/AdminContent';

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
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, testimonials: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, t, m] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }),
        ]);
        setStats({ projects: p.count || 0, testimonials: t.count || 0, messages: m.count || 0 });
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-white">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card"><div className="text-3xl font-display font-bold text-[var(--accent-cyan)] mb-1">{stats.projects}</div><div className="text-[var(--text-secondary)] text-sm">Projects</div></div>
        <div className="glass-card"><div className="text-3xl font-display font-bold text-[var(--accent-cyan)] mb-1">{stats.testimonials}</div><div className="text-[var(--text-secondary)] text-sm">Testimonials</div></div>
        <div className="glass-card"><div className="text-3xl font-display font-bold text-[var(--accent-cyan)] mb-1">{stats.messages}</div><div className="text-[var(--text-secondary)] text-sm">Messages</div></div>
      </div>
      <div className="glass-card">
        <h3 className="text-xl font-bold text-white mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/projects" className="p-4 bg-[var(--bg-card)] rounded-lg hover:border-[var(--accent-cyan)] transition-colors"><div className="text-[var(--accent-cyan)] font-semibold">Manage Projects</div><div className="text-[var(--text-secondary)] text-sm">Create, edit, delete</div></a>
          <a href="/admin/testimonials" className="p-4 bg-[var(--bg-card)] rounded-lg hover:border-[var(--accent-cyan)] transition-colors"><div className="text-[var(--accent-cyan)] font-semibold">Manage Testimonials</div><div className="text-[var(--text-secondary)] text-sm">Add customer reviews</div></a>
          <a href="/admin/messages" className="p-4 bg-[var(--bg-card)] rounded-lg hover:border-[var(--accent-cyan)] transition-colors"><div className="text-[var(--accent-cyan)] font-semibold">View Messages</div><div className="text-[var(--text-secondary)] text-sm">Contact form</div></a>
          <a href="/admin/content" className="p-4 bg-[var(--bg-card)] rounded-lg hover:border-[var(--accent-cyan)] transition-colors"><div className="text-[var(--accent-cyan)] font-semibold">Edit Content</div><div className="text-[var(--text-secondary)] text-sm">Site text content</div></a>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (!session) navigate('/admin/login');
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) navigate('/admin/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isAuthenticated === null) return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="content" element={<AdminContent />} />
      </Routes>
    </AdminLayout>
  );
};

const Admin: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default Admin;
