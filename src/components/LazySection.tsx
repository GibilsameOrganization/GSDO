import React, { Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
  </div>
);

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <DefaultFallback />,
  className = "",
  minHeight = "200px"
}) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ minHeight: isIntersecting ? 'auto' : minHeight }}
    >
      {isIntersecting ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        <div className="flex items-center justify-center" style={{ height: minHeight }}>
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default LazySection; 