import React, { useState } from 'react';
import { translateToEnglish } from '../../lib/translator';

interface BilingualInputProps {
  label: string;
  valueFr: string;
  valueEn: string;
  onChangeFr: (val: string) => void;
  onChangeEn: (val: string) => void;
  placeholder?: string;
  type?: 'input' | 'textarea';
  rows?: number;
}

const BilingualInput: React.FC<BilingualInputProps> = ({ 
  label, valueFr, valueEn, onChangeFr, onChangeEn, placeholder, type = 'textarea', rows = 3 
}) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslateEn = async () => {
    if (!valueFr) return;
    setIsTranslating(true);
    try {
      const translated = await translateToEnglish(valueFr);
      onChangeEn(translated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-white">{label}</label>
        <button
          type="button"
          onClick={handleTranslateEn}
          disabled={isTranslating || !valueFr}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-[#141430] border border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTranslating ? (
            <span className="w-3 h-3 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>✨ Auto EN</span>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champ Français */}
        <div className="relative">
          <span className="absolute top-2 left-2 text-[10px] font-bold text-[#4A5568] uppercase bg-[#141430] px-1 rounded">FR</span>
          {type === 'textarea' ? (
            <textarea
              value={valueFr}
              onChange={(e) => onChangeFr(e.target.value)}
              rows={rows}
              className="w-full bg-[#141430] border border-[#1A1A2E] rounded-lg pt-6 pb-2 px-3 text-white text-sm focus:outline-none focus:border-[#00BFFF] resize-none"
              placeholder={`${placeholder} (FR)`}
            />
          ) : (
            <input
              type="text"
              value={valueFr}
              onChange={(e) => onChangeFr(e.target.value)}
              className="w-full bg-[#141430] border border-[#1A1A2E] rounded-lg pt-6 pb-2 px-3 text-white text-sm focus:outline-none focus:border-[#00BFFF]"
              placeholder={`${placeholder} (FR)`}
            />
          )}
        </div>

        {/* Champ Anglais */}
        <div className="relative">
          <span className="absolute top-2 left-2 text-[10px] font-bold text-[#4A5568] uppercase bg-[#141430] px-1 rounded">EN</span>
          {type === 'textarea' ? (
            <textarea
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              rows={rows}
              className="w-full bg-[#141430] border border-[#1A1A2E] rounded-lg pt-6 pb-2 px-3 text-[#A8B4C8] text-sm focus:outline-none focus:border-[#00BFFF] resize-none"
              placeholder="English translation..."
            />
          ) : (
            <input
              type="text"
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              className="w-full bg-[#141430] border border-[#1A1A2E] rounded-lg pt-6 pb-2 px-3 text-[#A8B4C8] text-sm focus:outline-none focus:border-[#00BFFF]"
              placeholder="English translation..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BilingualInput;