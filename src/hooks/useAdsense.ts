
import { useEffect, useState, useCallback } from 'react';
import { useCookieConsent } from './useCookieConsent';

interface AdConfig {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
}

interface UseAdsenseOptions {
  publisherId?: string;
  testMode?: boolean;
}

export const useAdsense = (options: UseAdsenseOptions = {}) => {
  const { publisherId, testMode = import.meta.env.MODE !== 'production' } = options;
  const { canUseAdvertising } = useCookieConsent();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!canUseAdvertising || !publisherId) {
      return;
    }

    // Check if AdSense is already loaded
    if (window.adsbygoogle) {
      setIsLoaded(true);
      return;
    }

    // Load AdSense script
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setIsBlocked(true);
      console.warn('AdSense blocked - likely by an ad blocker');
    };

    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Script may have already been removed
      }
    };
  }, [canUseAdvertising, publisherId]);

  const initializeAd = useCallback((element: HTMLElement, config: AdConfig) => {
    if (!isLoaded || isBlocked || !canUseAdvertising) {
      return false;
    }

    try {
      // Create ad container
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.dataset.adClient = options.publisherId || '';
      ins.dataset.adSlot = config.adSlot;
      
      if (config.adFormat) {
        ins.dataset.adFormat = config.adFormat;
      }
      
      if (config.fullWidthResponsive) {
        ins.dataset.fullWidthResponsive = 'true';
      }

      element.innerHTML = '';
      element.appendChild(ins);

      // Push ad to AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      return true;
    } catch (error) {
      console.error('Error initializing ad:', error);
      return false;
    }
  }, [isLoaded, isBlocked, canUseAdvertising, options.publisherId]);

  return {
    isLoaded,
    isBlocked,
    canShowAds: canUseAdvertising && isLoaded && !isBlocked,
    initializeAd,
    testMode,
  };
};

// Extend window for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
