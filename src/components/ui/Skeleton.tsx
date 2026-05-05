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

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'text' 
}) => {
  const baseClasses = 'animate-pulse bg-[var(--bg-card)] rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    circle: 'rounded-full aspect-square',
    rect: 'aspect-video',
    card: 'h-48 w-full',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="status"
      aria-label="Chargement..."
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          className={i === lines - 1 ? 'w-2/3' : 'w-full'} 
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="circle" className="w-16 h-16 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonProjectsList: React.FC = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
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
};
