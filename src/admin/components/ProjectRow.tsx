import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProjectRow — Row component for project list in admin
 *
 * P-13 FIX: Replaced emoji (📁, 📖, ✏️, 🗑) with SVG icons
 */

interface ProjectData {
  id: string;
  title_fr: string;
  title_en: string;
  status: 'delivered' | 'in_progress' | 'concept';
  image_url?: string;
  stack?: string[];
  is_visible: boolean;
  is_featured: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisible: () => void;
  onToggleFeatured: () => void;
  onEditCaseStudy?: () => void;
}

const ProjectRow: React.FC<ProjectData> = ({
  id, title_fr, title_en, status, image_url, stack,
  is_visible, is_featured, onEdit, onDelete, onToggleVisible, onToggleFeatured, onEditCaseStudy
}) => {
  
  const getStatusStyle = (s: string) => {
    switch(s) {
      case 'delivered': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusLabel = (s: string) => {
    switch(s) {
      case 'delivered': return 'Livré';
      case 'in_progress': return 'En cours';
      default: return 'Concept';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-center gap-5 p-4 bg-[#0F0F2E] border-b border-[#1A1A2E] hover:bg-[#141430] transition-all duration-200"
    >
      {/* 1. Image Thumbnail */}
      <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-[#0A0A1E] border border-[#1A1A2E] shadow-sm">
        {image_url ? (
          <img src={image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#4A5568]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
          </div>
        )}
      </div>

      {/* 2. Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-sm truncate group-hover:text-[#00BFFF] transition-colors">{title_fr}</h3>
        <p className="text-[#4A5568] text-xs truncate">{title_en}</p>
        {stack && stack.length > 0 && (
          <div className="flex gap-1 mt-1">
            {stack.slice(0, 3).map((tech, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-[#0A0A1E] rounded text-[10px] text-[#A8B4C8]">{tech}</span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Status Badge */}
      <div className="hidden md:block">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(status)}`}>
          {getStatusLabel(status)}
        </span>
      </div>

      {/* 4. Toggles (Visible / Featured) */}
      <div className="flex flex-col gap-2 items-center">
        {/* Visible */}
        <div className="flex items-center gap-2 group/toggle">
          <button 
            onClick={onToggleVisible}
            className={`w-8 h-4 rounded-full transition-colors ${is_visible ? 'bg-[#00BFFF]' : 'bg-[#1A1A2E]'}`}
            aria-label={is_visible ? 'Masquer le projet' : 'Afficher le projet'}
          >
            <span className={`block w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${is_visible ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-[10px] text-[#4A5568] opacity-0 group-hover/toggle:opacity-100 transition-opacity">Vis</span>
        </div>
        {/* Featured */}
        <div className="flex items-center gap-2 group/toggle">
          <button 
            onClick={onToggleFeatured}
            className={`w-8 h-4 rounded-full transition-colors ${is_featured ? 'bg-yellow-500' : 'bg-[#1A1A2E]'}`}
            aria-label={is_featured ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <span className={`block w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${is_featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-[10px] text-[#4A5568] opacity-0 group-hover/toggle:opacity-100 transition-opacity">Star</span>
        </div>
      </div>

      {/* 5. Actions */}
      <div className="flex items-center gap-1">
        {onEditCaseStudy && (
          <button onClick={onEditCaseStudy} className="p-2 text-[#4A5568] hover:text-[#00BFFF] hover:bg-[#00BFFF]/10 rounded-lg transition-all" title="Étude de cas" aria-label="Éditer l'étude de cas">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </button>
        )}
        <button onClick={onEdit} className="p-2 text-[#4A5568] hover:text-white hover:bg-[#1A1A2E] rounded-lg transition-all" title="Modifier" aria-label="Modifier le projet">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={onDelete} className="p-2 text-[#4A5568] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Supprimer" aria-label="Supprimer le projet">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectRow;
