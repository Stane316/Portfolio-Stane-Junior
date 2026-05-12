import React, { useState, useRef, useEffect } from 'react';

interface ImageWithLazyLoadProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

const ImageWithLazyLoad: React.FC<ImageWithLazyLoadProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden bg-[#141430] ${wrapperClassName}`}>
      {/* Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-5 h-5 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Placeholder si erreur */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-[#4A5568]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={isInView ? src : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
      />
    </div>
  );
};

export default ImageWithLazyLoad;