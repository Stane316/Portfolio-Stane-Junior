import React from 'react';
import { VisionData } from '../types';
import BilingualInput from './BilingualInput';

interface AdminGrowTechVisionProps {
  vision: VisionData;
  onChange: (vision: VisionData) => void;
}

const AdminGrowTechVision: React.FC<AdminGrowTechVisionProps> = ({ vision, onChange }) => {
  const updateField = (field: keyof VisionData, value: string) => {
    onChange({
      ...vision,
      [field]: value
    });
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Vision de l'agence</h3>
      
      <BilingualInput
        label="Titre"
        valueFr={vision.title_fr}
        valueEn={vision.title_en}
        onChangeFr={(v) => updateField('title_fr', v)}
        onChangeEn={(v) => updateField('title_en', v)}
        type="input"
      />
      
      <BilingualInput
        label="Contenu"
        valueFr={vision.content_fr}
        valueEn={vision.content_en}
        onChangeFr={(v) => updateField('content_fr', v)}
        onChangeEn={(v) => updateField('content_en', v)}
        rows={3}
      />
      
      <p className="text-xs text-[#4A5568] mt-1">Les modifications sont stockées localement. Cliquez sur « Enregistrer » en haut ou en bas pour tout valider.</p>
    </div>
  );
};

export default AdminGrowTechVision;
