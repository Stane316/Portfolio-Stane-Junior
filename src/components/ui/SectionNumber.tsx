import React from 'react';

interface SectionNumberProps {
  number: string; // Ex: "01"
}

const SectionNumber: React.FC<SectionNumberProps> = ({ number }) => {
  return (
    <span className="absolute top-0 left-0 sm:left-10 lg:left-20 -mt-10 sm:-mt-16 text-[12rem] sm:text-[18rem] lg:text-[24rem] leading-none font-heading text-white opacity-[0.03] select-none pointer-events-none z-0">
      {number}
    </span>
  );
};

export default SectionNumber;