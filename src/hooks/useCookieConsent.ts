
import { useState, useEffect } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    advertising: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
    setHasConsent(consent);

    if (consent) {
      const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    }
  }, []);

  const canUseAnalytics = hasConsent && preferences.analytics;
  const canUseAdvertising = hasConsent && preferences.advertising;
  const canUseFunctional = hasConsent && preferences.functional;

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    window.location.reload();
  };

  return {
    hasConsent,
    preferences,
    canUseAnalytics,
    canUseAdvertising,
    canUseFunctional,
    resetConsent,
  };
};
