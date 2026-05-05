import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface CaseStudyEditorProps {
  projectId: string;
  onClose: () => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  initialData?: { fr: any; en: any };
}

const CaseStudyEditor: React.FC<CaseStudyEditorProps> = ({ projectId, onClose, onToast, initialData }) => {
  const [activeLang, setActiveLang] = useState<'fr' | 'en'>('fr');
  const [saving, setSaving] = useState(false);

  const defaultSteps = [
    { key: 'step1', icon: '🔍', titleFr: 'Le problème', titleEn: 'The problem' },
    { key: 'step2', icon: '💡', titleFr: 'La solution', titleEn: 'The solution' },
    { key: 'step3', icon: '⚙️', titleFr: 'Fonctionnalités', titleEn: 'Features' },
    { key: 'step4', icon: '🚧', titleFr: 'Les obstacles', titleEn: 'Obstacles' },
    { key: 'step5', icon: '🎯', titleFr: 'Le résultat', titleEn: 'The result' },
  ];

  const [caseStudy, setCaseStudy] = useState(() => {
    const fr: Record<string, { title: string; content: string }> = {};
    const en: Record<string, { title: string; content: string }> = {};
    defaultSteps.forEach((step) => {
      const existingFr = initialData?.fr?.[step.key];
      const existingEn = initialData?.en?.[step.key];
      fr[step.key] = { title: existingFr?.title || step.titleFr, content: existingFr?.content || '' };
      en[step.key] = { title: existingEn?.title || step.titleEn, content: existingEn?.content || '' };
    });
    return { fr, en };
  });

  const handleSave = async () => {
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase
        .from('projects')
        .update({ case_study_fr: caseStudy.fr, case_study_en: caseStudy.en })
        .eq('id', projectId);
      if (error) throw error;
      onToast('success', 'Étude de cas sauvegardée !');
      onClose();
    } catch (err: any) {
      onToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStep = (lang: 'fr' | 'en', stepKey: string, field: 'title' | 'content', value: string) => {
    setCaseStudy((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [stepKey]: { ...prev[lang][stepKey], [field]: value },
      },
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-[#0A0A1E] bg-opacity-95 backdrop-blur-xl border-b border-[rgba(0,191,255,0.15)] p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-display font-bold text-white">📖 Étude de cas</h2>
            <p className="text-[#A8B4C8] text-sm">Structurez le parcours de votre projet</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex bg-[#141430] rounded-lg p-1">
              <button onClick={() => setActiveLang('fr')} className={`px-3 py-1 rounded-md text-sm transition-colors ${activeLang === 'fr' ? 'bg-[#00BFFF] text-black font-semibold' : 'text-[#A8B4C8] hover:text-white'}`}>FR</button>
              <button onClick={() => setActiveLang('en')} className={`px-3 py-1 rounded-md text-sm transition-colors ${activeLang === 'en' ? 'bg-[#00BFFF] text-black font-semibold' : 'text-[#A8B4C8] hover:text-white'}`}>EN</button>
            </div>
            <button onClick={onClose} className="p-2 text-[#A8B4C8] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-6">
          {defaultSteps.map((step, index) => {
            const data = caseStudy[activeLang][step.key];
            return (
              <motion.div key={step.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative">
                {/* Connecting line */}
                {index > 0 && <div className="absolute left-6 top-0 w-0.5 h-4 bg-[rgba(0,191,255,0.15)] -mt-6" />}
                <div className="flex items-start gap-4">
                  {/* Step icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#141430] border border-[rgba(0,191,255,0.15)] flex items-center justify-center text-2xl">
                      {step.icon}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00BFFF] font-semibold text-sm">{index + 1}.</span>
                      <input
                        type="text"
                        value={data.title}
                        onChange={(e) => updateStep(activeLang, step.key, 'title', e.target.value)}
                        className="flex-1 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-[#00BFFF]"
                        placeholder={activeLang === 'fr' ? 'Titre de l\'étape' : 'Step title'}
                      />
                    </div>
                    <textarea
                      value={data.content}
                      onChange={(e) => updateStep(activeLang, step.key, 'content', e.target.value)}
                      rows={3}
                      className="w-full bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg px-3 py-2 text-[#A8B4C8] text-sm resize-none focus:outline-none focus:border-[#00BFFF]"
                      placeholder={activeLang === 'fr' ? 'Décrivez cette étape...' : 'Describe this step...'}
                    />
                    {/* Preview other language */}
                    {activeLang === 'fr' && caseStudy.en[step.key].title && (
                      <p className="text-[#4A5568] text-xs italic pl-2 border-l-2 border-[rgba(0,191,255,0.15)]">
                        EN: {caseStudy.en[step.key].title}
                      </p>
                    )}
                    {activeLang === 'en' && caseStudy.fr[step.key].title && (
                      <p className="text-[#4A5568] text-xs italic pl-2 border-l-2 border-[rgba(0,191,255,0.15)]">
                        FR: {caseStudy.fr[step.key].title}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0A0A1E] bg-opacity-95 backdrop-blur-xl border-t border-[rgba(0,191,255,0.15)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#4A5568] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>5 étapes structurées • FR + EN</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary text-sm py-2 px-6">Annuler</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-6 inline-flex items-center gap-2">
              {saving ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Sauvegarde...</>
              ) : (
                <>💾 Sauvegarder</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CaseStudyEditor;