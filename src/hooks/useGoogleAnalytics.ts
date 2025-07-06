
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const useGoogleAnalytics = (measurementId?: string) => {
  const location = useLocation();

  useEffect(() => {
    if (!measurementId || import.meta.env.MODE !== 'production') {
      return;
    }

    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      document.head.removeChild(script);
    };
  }, [measurementId]);

  // Track page views
  useEffect(() => {
    if (window.gtag && measurementId) {
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  // Return tracking functions
  const trackEvent = (eventName: string, parameters?: any) => {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackConversion = (conversionId: string, value?: number) => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: 'USD'
      });
    }
  };

  return { trackEvent, trackConversion };
};
