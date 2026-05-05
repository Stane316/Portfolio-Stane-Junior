/**
 * Skeleton Loading Components
 * 
 * Placeholder components shown while data is loading.
 * Improves perceived performance.
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-[#141430] rounded';
  const variantClasses = {
    text: 'h-4 w-full',
    circle: 'rounded-full aspect-square',
    rect: 'aspect-video',
    card: 'h-48 w-full',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="status" aria-label="Chargement..." />;
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
    ))}
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="glass-card">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton variant="circle" className="w-16 h-16 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4" />
        <Skeleton className="w-1/2" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonProjectsList: React.FC = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonHero: React.FC = () => (
  <div className="space-y-6">
    <Skeleton variant="rect" className="h-8 w-48 mx-auto lg:mx-0" />
    <Skeleton variant="text" className="h-12 w-full" />
    <Skeleton variant="text" className="h-12 w-3/4" />
    <div className="flex gap-4">
      <Skeleton variant="rect" className="h-12 w-32" />
      <Skeleton variant="rect" className="h-12 w-32" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card p-4">
          <Skeleton variant="text" className="h-8 w-12 mx-auto mb-2" />
          <Skeleton variant="text" className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonAbout: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div className="flex justify-center">
      <Skeleton variant="circle" className="w-64 h-64 lg:w-80 lg:h-80" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <SkeletonText lines={5} />
      <Skeleton className="h-10 w-40 mt-4" />
    </div>
  </div>
);

export const SkeletonSkills: React.FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-64 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="glass-card p-4 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
          <SkeletonText lines={2} />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonTestimonials: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);