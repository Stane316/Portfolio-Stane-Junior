import React from 'react';
import { motion } from 'framer-motion';

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
          <div className="w-full h-full flex items-center justify-center text-xl text-[#4A5568]">📁</div>
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
          >
            <span className={`block w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${is_featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-[10px] text-[#4A5568] opacity-0 group-hover/toggle:opacity-100 transition-opacity">Star</span>
        </div>
      </div>

      {/* 5. Actions */}
      <div className="flex items-center gap-1">
        {onEditCaseStudy && (
          <button onClick={onEditCaseStudy} className="p-2 text-[#4A5568] hover:text-[#00BFFF] hover:bg-[#00BFFF]/10 rounded-lg transition-all" title="Étude de cas">
            📖
          </button>
        )}
        <button onClick={onEdit} className="p-2 text-[#4A5568] hover:text-white hover:bg-[#1A1A2E] rounded-lg transition-all" title="Modifier">
          ✏️
        </button>
        <button onClick={onDelete} className="p-2 text-[#4A5568] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Supprimer">
          🗑
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectRow;