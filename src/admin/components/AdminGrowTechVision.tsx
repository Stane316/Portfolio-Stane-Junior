import React from 'react';
import { VisionData } from '../types';
import BilingualInput from './BilingualInput';

interface AdminGrowTechVisionProps {
  vision: VisionData;
  onSave: (vision: VisionData) => void;
}

const AdminGrowTechVision: React.FC<AdminGrowTechVisionProps> = ({ vision, onSave }) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Vision de l'agence</h3>
      <BilingualInput label="Titre" valueFr={vision.title_fr} valueEn={vision.title_en} onChangeFr={(v) => onSave({ ...vision, title_fr: v })} onChangeEn={(v) => onSave({ ...vision, title_en: v })} type="input" />
      <BilingualInput label="Contenu" valueFr={vision.content_fr} valueEn={vision.content_en} onChangeFr={(v) => onSave({ ...vision, content_fr: v })} onChangeEn={(v) => onSave({ ...vision, content_en: v })} rows={3} />
    </div>
  );
};

export default AdminGrowTechVision;