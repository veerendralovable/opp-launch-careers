
import { useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

export const usePerformanceTracking = (pageName: string) => {
  useEffect(() => {
    const trackPerformance = () => {
      // Track Core Web Vitals
      if ('web-vital' in window) {
        return;
      }

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const metrics: PerformanceMetrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      };

      // First Contentful Paint
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        metrics.firstContentfulPaint = fcp.startTime;
      }

      // Log metrics for analysis
      console.log(`Performance metrics for ${pageName}:`, metrics);

      // In production, send to analytics
      if (import.meta.env.MODE === 'production' && window.gtag) {
        window.gtag('event', 'page_performance', {
          page_name: pageName,
          page_load_time: Math.round(metrics.pageLoadTime),
          dom_content_loaded: Math.round(metrics.domContentLoaded),
          first_contentful_paint: metrics.firstContentfulPaint ? Math.round(metrics.firstContentfulPaint) : undefined
        });
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }

    return () => {
      window.removeEventListener('load', trackPerformance);
    };
  }, [pageName]);
};
