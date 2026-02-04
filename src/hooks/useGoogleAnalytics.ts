
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsConfig {
  measurementId?: string;
  debugMode?: boolean;
}

export const useGoogleAnalytics = (config: GoogleAnalyticsConfig = {}) => {
  const { measurementId, debugMode = import.meta.env.MODE !== 'production' } = config;
  const location = useLocation();

  // Initialize GA4 with consent mode
  useEffect(() => {
    if (!measurementId) {
      return;
    }

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Set default consent state (denied until user consents)
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied',
      'security_storage': 'granted',
    });

    // Check for existing consent
    const storedConsent = localStorage.getItem('cookie_consent');
    const storedPreferences = localStorage.getItem('cookie_preferences');
    
    if (storedConsent === 'true' && storedPreferences) {
      const preferences = JSON.parse(storedPreferences);
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_storage': preferences.advertising ? 'granted' : 'denied',
        'ad_user_data': preferences.advertising ? 'granted' : 'denied',
        'ad_personalization': preferences.advertising ? 'granted' : 'denied',
        'functionality_storage': preferences.functional ? 'granted' : 'denied',
        'personalization_storage': preferences.functional ? 'granted' : 'denied',
      });
    }

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize GA4
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      debug_mode: debugMode,
      send_page_view: false, // We'll send page views manually for better control
    });

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Script might have already been removed
      }
    };
  }, [measurementId, debugMode]);

  // Track page views on route change
  useEffect(() => {
    if (!measurementId || !window.gtag) {
      return;
    }

    // Small delay to ensure page title is updated
    const timeoutId = setTimeout(() => {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location, measurementId]);

  // Track custom events
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (!window.gtag || !measurementId) {
      if (debugMode) {
        console.log('[GA4 Debug] Event:', eventName, parameters);
      }
      return;
    }

    try {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Google Analytics event tracking error:', error);
    }
  }, [measurementId, debugMode]);

  // Track conversions
  const trackConversion = useCallback((conversionId: string, value?: number, currency: string = 'USD') => {
    if (!window.gtag || !measurementId) {
      return;
    }

    try {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: currency,
      });
    } catch (error) {
      console.error('Google Analytics conversion tracking error:', error);
    }
  }, [measurementId]);

  // Track user properties
  const setUserProperties = useCallback((properties: Record<string, any>) => {
    if (!window.gtag || !measurementId) {
      return;
    }

    try {
      window.gtag('set', 'user_properties', properties);
    } catch (error) {
      console.error('Google Analytics user properties error:', error);
    }
  }, [measurementId]);

  // Track scroll depth
  const trackScrollDepth = useCallback((depth: number) => {
    trackEvent('scroll_depth', {
      depth_percentage: depth,
      page_path: location.pathname,
    });
  }, [trackEvent, location.pathname]);

  // Track search
  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  }, [trackEvent]);

  // Track opportunity view
  const trackOpportunityView = useCallback((opportunityId: string, opportunityTitle: string, type: string) => {
    trackEvent('view_item', {
      item_id: opportunityId,
      item_name: opportunityTitle,
      item_category: type,
    });
  }, [trackEvent]);

  // Track bookmark action
  const trackBookmark = useCallback((opportunityId: string, action: 'add' | 'remove') => {
    trackEvent('bookmark', {
      item_id: opportunityId,
      action: action,
    });
  }, [trackEvent]);

  // Track share action
  const trackShare = useCallback((opportunityId: string, method: string) => {
    trackEvent('share', {
      item_id: opportunityId,
      method: method,
    });
  }, [trackEvent]);

  // Track signup
  const trackSignup = useCallback((method: string) => {
    trackEvent('sign_up', {
      method: method,
    });
  }, [trackEvent]);

  // Track login
  const trackLogin = useCallback((method: string) => {
    trackEvent('login', {
      method: method,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackConversion,
    setUserProperties,
    trackScrollDepth,
    trackSearch,
    trackOpportunityView,
    trackBookmark,
    trackShare,
    trackSignup,
    trackLogin,
  };
};
