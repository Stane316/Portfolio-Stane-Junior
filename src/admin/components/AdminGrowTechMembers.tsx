import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember } from '../types';
import FileUpload from './FileUpload';
import ImageWithLazyLoad from '../../components/ui/ImageWithLazyLoad';

interface AdminGrowTechMembersProps {
  members: TeamMember[];
  onSave: (members: TeamMember[]) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
}

const AdminGrowTechMembers: React.FC<AdminGrowTechMembersProps> = ({ members, onSave, onToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({ name: member.name, role_fr: member.role_fr, role_en: member.role_en, initial: member.initial, image_url: member.image_url });
    setShowForm(true);
  };

  const handleSave = () => {
    const newMember: TeamMember = {
      id: editingMember ? editingMember.id : Date.now().toString(),
      ...memberForm,
      order: members.length
    };

    if (editingMember) {
      const updated = members.map((m) => m.id === editingMember.id ? newMember : m);
      onSave(updated);
      onToast('success', 'Membre modifié !');
    } else {
      onSave([...members, newMember]);
      onToast('success', 'Membre ajouté !');
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMember(null);
    setMemberForm({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });
  };

  const handleRemove = (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return;
    onSave(members.filter((m) => m.id !== id));
    onToast('success', 'Membre supprimé !');
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-[#1A1A2E] pb-2">
        <h3 className="text-white font-semibold text-lg">Équipe ({members.length})</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">+ Ajouter / Modifier</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#1A1A2E] pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input placeholder="Nom complet" value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              <input placeholder="Initiales (ex: SJ)" value={memberForm.initial} onChange={e => setMemberForm({ ...memberForm, initial: e.target.value })} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              <input placeholder="Rôle (FR)" value={memberForm.role_fr} onChange={e => setMemberForm({ ...memberForm, role_fr: e.target.value })} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              <input placeholder="Role (EN)" value={memberForm.role_en} onChange={e => setMemberForm({ ...memberForm, role_en: e.target.value })} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
            </div>
            <FileUpload label="Photo Membre" bucket="portfolio-assets" folder="team" currentUrl={memberForm.image_url} onChange={(url) => setMemberForm({ ...memberForm, image_url: url })} />
            <div className="flex gap-3 mt-3">
              <button onClick={handleSave} className="flex-1 bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">{editingMember ? 'Modifier' : 'Enregistrer'}</button>
              {editingMember && <button onClick={resetForm} className="px-4 bg-[#1A1A2E] text-white rounded">Annuler</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 mt-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between bg-[#141430] p-3 rounded border border-[#1A1A2E]">
            <div className="flex items-center gap-3">
              {member.image_url ? <ImageWithLazyLoad src={member.image_url} alt={member.name} className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-[#0A0A1E] flex items-center justify-center text-xs font-bold text-[#00BFFF]">{member.initial}</div>}
              <div>
                <p className="text-white text-sm font-medium">{member.name}</p>
                <p className="text-[#4A5568] text-xs">{member.role_fr}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenEdit(member)} className="p-1 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" aria-label="Modifier le membre">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => handleRemove(member.id)} className="p-1 text-[#A8B4C8] hover:text-red-400 transition-colors" aria-label="Supprimer le membre">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && <p className="text-[#4A5568] text-center italic py-4">Aucun membre ajouté.</p>}
      </div>
    </div>
  );
};

export default AdminGrowTechMembers;