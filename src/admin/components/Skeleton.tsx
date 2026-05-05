import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-[#141430] rounded';
  const variantClasses = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rect: 'aspect-video',
    card: 'h-48 w-full',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
    ))}
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="rounded-xl border border-[rgba(0,191,255,0.15)] bg-[#141430] p-5 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton variant="circle" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4" />
        <Skeleton className="w-1/2" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border-b border-[rgba(0,191,255,0.1)]">
    <Skeleton className="w-8 h-8 rounded" />
    <Skeleton className="flex-1" />
    <Skeleton className="w-20 h-6 rounded-full" />
    <div className="flex gap-2">
      <Skeleton variant="circle" className="w-8 h-8" />
      <Skeleton variant="circle" className="w-8 h-8" />
    </div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  </div>
);