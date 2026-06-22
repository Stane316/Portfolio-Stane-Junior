import React from 'react';
interface SectionSkeletonProps { height?: string; className?: string; }
const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ height = 'h-96', className = '' }) => (
  <div className={`container-custom py-16 ${className}`}>
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="h-8 w-48 bg-[#141430] rounded" />
        <div className="h-4 w-72 bg-[#141430] rounded" />
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${height}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[#141430] rounded-xl p-6 space-y-4">
            <div className="h-6 w-2/3 bg-[#1F1F3A] rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-[#1F1F3A] rounded w-full" />
              <div className="h-4 bg-[#1F1F3A] rounded w-5/6" />
              <div className="h-4 bg-[#1F1F3A] rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default SectionSkeleton;
