import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember } from '../types';
import FileUpload from './FileUpload';

interface AdminGrowTechMembersProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
}

const AdminGrowTechMembers: React.FC<AdminGrowTechMembersProps> = ({ members, onChange, onToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role_fr: member.role_fr,
      role_en: member.role_en,
      initial: member.initial,
      image_url: member.image_url || ''
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!memberForm.name.trim()) {
      onToast('error', 'Le nom est requis');
      return;
    }

    const newMember: TeamMember = {
      id: editingMember ? editingMember.id : Date.now().toString(),
      name: memberForm.name.trim(),
      role_fr: memberForm.role_fr.trim(),
      role_en: memberForm.role_en.trim(),
      initial: memberForm.initial.trim().toUpperCase() || memberForm.name.trim().substring(0, 2).toUpperCase(),
      image_url: memberForm.image_url,
      order: editingMember ? editingMember.order : members.length
    };

    let updatedMembers: TeamMember[];

    if (editingMember) {
      updatedMembers = members.map(m => m.id === editingMember.id ? newMember : m);
      onToast('success', 'Membre modifié');
    } else {
      updatedMembers = [...members, newMember];
      onToast('success', 'Membre ajouté');
    }

    onChange(updatedMembers);
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMember(null);
    setMemberForm({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });
  };

  const handleRemove = (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return;
    const filtered = members.filter(m => m.id !== id);
    onChange(filtered);
    onToast('success', 'Membre supprimé');
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-[#1A1A2E] pb-2">
        <h3 className="text-white font-semibold text-lg">Équipe ({members.length})</h3>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold"
        >
          + Ajouter un membre
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#1A1A2E] pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                placeholder="Nom complet"
                value={memberForm.name}
                onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm"
              />
              <input
                placeholder="Initiales (ex: SJ)"
                value={memberForm.initial}
                onChange={e => setMemberForm({ ...memberForm, initial: e.target.value })}
                className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm"
              />
              <input
                placeholder="Rôle (FR)"
                value={memberForm.role_fr}
                onChange={e => setMemberForm({ ...memberForm, role_fr: e.target.value })}
                className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm"
              />
              <input
                placeholder="Rôle (EN)"
                value={memberForm.role_en}
                onChange={e => setMemberForm({ ...memberForm, role_en: e.target.value })}
                className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm"
              />
            </div>

            <FileUpload
              label="Photo du membre"
              bucket="portfolio-assets"
              folder="team"
              currentUrl={memberForm.image_url}
              onChange={(url) => setMemberForm({ ...memberForm, image_url: url })}
              accept="image/*"
              maxSizeMB={4}
            />

            <div className="flex gap-3 mt-3">
              <button onClick={handleSave} className="flex-1 bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">
                {editingMember ? 'Modifier' : 'Ajouter'}
              </button>
              <button onClick={resetForm} className="px-4 bg-[#1A1A2E] text-white rounded">Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 mt-4">
        {members.length === 0 && (
          <div className="text-sm text-[#4A5568] italic py-2">Aucun membre pour le moment.</div>
        )}
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between bg-[#141430] rounded-xl p-3">
            <div className="flex items-center gap-3">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-sm font-bold">
                  {member.initial}
                </div>
              )}
              <div>
                <div className="font-medium text-white">{member.name}</div>
                <div className="text-xs text-[#A8B4C8]">{member.role_fr}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenEdit(member)} className="text-xs px-3 py-1 bg-[#1A1A2E] rounded">Modifier</button>
              <button onClick={() => handleRemove(member.id)} className="text-xs px-3 py-1 bg-red-900/30 text-red-400 rounded">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGrowTechMembers;
