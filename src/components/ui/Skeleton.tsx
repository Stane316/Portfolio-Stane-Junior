/**
 * Skeleton Loading Components
 * 
 * Placeholder components shown while data is loading.
 * Improves perceived performance.
 *
 * P-15 FIX: Added skeleton-shimmer animation, comprehensive section skeletons
 * for Hero, About, Skills, Projects, Testimonials, Vision, Contact sections
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card' | 'shimmer';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const baseClasses = variant === 'shimmer'
    ? 'skeleton-shimmer rounded'
    : 'animate-pulse bg-[#141430] rounded';
  const variantClasses = {
    text: 'h-4 w-full',
    circle: 'rounded-full aspect-square',
    rect: 'aspect-video',
    card: 'h-48 w-full',
    shimmer: 'h-4 w-full',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="status" aria-label="Chargement..." />;
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="shimmer" className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
    ))}
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="glass-card">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton variant="shimmer" className="w-16 h-16 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="shimmer" className="w-3/4" />
        <Skeleton variant="shimmer" className="w-1/2" />
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
    <Skeleton variant="shimmer" className="h-8 w-48 mx-auto lg:mx-0" />
    <Skeleton variant="shimmer" className="h-12 w-full" />
    <Skeleton variant="shimmer" className="h-12 w-3/4" />
    <div className="flex gap-4">
      <Skeleton variant="shimmer" className="h-12 w-32" />
      <Skeleton variant="shimmer" className="h-12 w-32" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card p-4">
          <Skeleton variant="shimmer" className="h-8 w-12 mx-auto mb-2" />
          <Skeleton variant="shimmer" className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonAbout: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
    <div className="lg:col-span-7 space-y-6">
      <Skeleton variant="shimmer" className="h-12 w-64" />
      <SkeletonText lines={4} />
      <SkeletonText lines={4} />
      <div className="flex flex-wrap gap-3 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="shimmer" className="h-8 w-32 rounded-lg" />
        ))}
      </div>
      <div className="flex gap-12 pt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton variant="shimmer" className="h-10 w-16 mb-2" />
            <Skeleton variant="shimmer" className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
    <div className="lg:col-span-5 flex flex-col gap-8">
      <Skeleton variant="shimmer" className="w-full aspect-[3/4] rounded-2xl" />
      <div className="bg-[#141430] p-6 rounded-xl">
        <SkeletonText lines={3} />
      </div>
    </div>
  </div>
);

export const SkeletonSkills: React.FC = () => (
  <div className="space-y-6">
    <Skeleton variant="shimmer" className="h-10 w-64 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 space-y-4">
          <Skeleton variant="shimmer" className="h-8 w-32" />
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton variant="shimmer" className="h-4 w-24" />
                <Skeleton variant="shimmer" className="h-4 w-12" />
              </div>
              <Skeleton variant="shimmer" className="h-1 w-full rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonProjects: React.FC = () => (
  <div className="space-y-12">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <Skeleton variant="shimmer" className="w-full aspect-video rounded-lg" />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <Skeleton variant="shimmer" className="h-8 w-3/4" />
          <SkeletonText lines={3} />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} variant="shimmer" className="h-7 w-20 rounded" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTestimonials: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-[#141430] border border-[#1A1A2E] rounded-xl overflow-hidden">
        <div className="p-6 flex items-center gap-4 border-b border-[#1A1A2E]">
          <Skeleton variant="shimmer" className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="shimmer" className="h-4 w-24" />
            <Skeleton variant="shimmer" className="h-3 w-16" />
          </div>
        </div>
        <div className="p-6 space-y-2">
          <SkeletonText lines={3} />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonVision: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-[#141430] border border-[#1A1A2E] rounded-3xl p-8 lg:p-10 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton variant="shimmer" className="h-8 w-32" />
          <Skeleton variant="shimmer" className="h-6 w-20 rounded-full" />
        </div>
        <SkeletonText lines={3} />
      </div>
    ))}
  </div>
);

export const SkeletonContact: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
    <div className="space-y-6">
      <Skeleton variant="shimmer" className="h-16 w-64" />
      <SkeletonText lines={2} />
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="shimmer" className="w-12 h-12 rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="shimmer" className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton variant="shimmer" className="h-3 w-16" />
              <Skeleton variant="shimmer" className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-[#141430] p-8 lg:p-12 rounded-2xl space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="shimmer" className="h-3 w-20" />
          <Skeleton variant="shimmer" className="h-12 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton variant="shimmer" className="h-3 w-16" />
      <Skeleton variant="shimmer" className="h-24 w-full rounded-lg" />
      <Skeleton variant="shimmer" className="h-12 w-full rounded-lg" />
    </div>
  </div>
);
