import React from 'react';

const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A1E]">
      
      {/* Blob Cyan (Gauche) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00BFFF] rounded-full blur-[120px] opacity-15 animate-drift"
      />
      
      {/* Blob Bleu (Droite) */}
      <div 
        className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#1A6FC4] rounded-full blur-[150px] opacity-15 animate-drift animation-delay-2000"
      />
      
      {/* Blob Accent (Bas Centre) */}
      <div 
        className="absolute bottom-[-20%] left-[20%] w-[400px] h-[400px] bg-[#00BFFF] rounded-full blur-[100px] opacity-10 animate-drift animation-delay-4000"
      />
      
    </div>
  );
};

export default HeroScene;