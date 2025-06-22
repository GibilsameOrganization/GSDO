// Performance monitoring utilities
import React from 'react';

export interface PerformanceMetrics {
  componentName: string;
  loadTime: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private loadStartTimes: Map<string, number> = new Map();

  startComponentLoad(componentName: string) {
    this.loadStartTimes.set(componentName, performance.now());
  }

  endComponentLoad(componentName: string) {
    const startTime = this.loadStartTimes.get(componentName);
    if (startTime) {
      const loadTime = performance.now() - startTime;
      const metric: PerformanceMetrics = {
        componentName,
        loadTime,
        timestamp: Date.now(),
      };
      
      this.metrics.push(metric);
      this.loadStartTimes.delete(componentName);
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      }
      
      return metric;
    }
    return null;
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageLoadTime(componentName?: string): number {
    const filteredMetrics = componentName 
      ? this.metrics.filter(m => m.componentName === componentName)
      : this.metrics;
    
    if (filteredMetrics.length === 0) return 0;
    
    const totalTime = filteredMetrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return totalTime / filteredMetrics.length;
  }

  clearMetrics() {
    this.metrics = [];
    this.loadStartTimes.clear();
  }

  // Report performance metrics (could be sent to analytics)
  reportMetrics() {
    const report = {
      totalComponents: this.metrics.length,
      averageLoadTime: this.getAverageLoadTime(),
      metrics: this.getMetrics(),
      timestamp: Date.now(),
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Report:', report);
    }
    
    // Here you could send to analytics service
    // analytics.track('performance_report', report);
    
    return report;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component performance monitoring
export const usePerformanceMonitoring = (componentName: string) => {
  React.useEffect(() => {
    performanceMonitor.startComponentLoad(componentName);
    
    return () => {
      performanceMonitor.endComponentLoad(componentName);
    };
  }, [componentName]);
};

// Web Vitals monitoring
export const measureWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      console.log('First Contentful Paint:', fcpEntry.startTime);
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('Largest Contentful Paint:', lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }
    }
  }
}; 