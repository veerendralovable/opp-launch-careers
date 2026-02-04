
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

export const getCookieConsent = (): boolean => {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
};

export const getCookiePreferences = (): CookiePreferences => {
  const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    essential: true,
    analytics: false,
    advertising: false,
    functional: false,
  };
};

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    advertising: false,
    functional: false,
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateGoogleConsent = (prefs: CookiePreferences) => {
    // Google Consent Mode v2 integration
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': prefs.analytics ? 'granted' : 'denied',
        'ad_storage': prefs.advertising ? 'granted' : 'denied',
        'ad_user_data': prefs.advertising ? 'granted' : 'denied',
        'ad_personalization': prefs.advertising ? 'granted' : 'denied',
        'functionality_storage': prefs.functional ? 'granted' : 'denied',
        'personalization_storage': prefs.functional ? 'granted' : 'denied',
        'security_storage': 'granted',
      });
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    updateGoogleConsent(prefs);
    setIsVisible(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
      functional: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const acceptSelected = () => {
    savePreferences(preferences);
  };

  const rejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      advertising: false,
      functional: false,
    };
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl">
        <Card className={cn(
          "shadow-2xl border-border/50 backdrop-blur-sm",
          "animate-in slide-in-from-bottom-5 duration-300"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cookie className="h-5 w-5 text-primary" />
                Cookie Preferences
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="h-8 w-8"
              >
                {showSettings ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience, analyze site traffic, and serve personalized ads. 
              By clicking "Accept All", you consent to our use of cookies. You can customize your preferences 
              or reject non-essential cookies.
            </p>

            {showSettings && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Essential Cookies</Label>
                    <p className="text-xs text-muted-foreground">Required for basic site functionality</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Analytics Cookies</Label>
                    <p className="text-xs text-muted-foreground">Help us understand how visitors use our site</p>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Advertising Cookies</Label>
                    <p className="text-xs text-muted-foreground">Used to show relevant ads and measure ad performance</p>
                  </div>
                  <Switch
                    checked={preferences.advertising}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, advertising: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Functional Cookies</Label>
                    <p className="text-xs text-muted-foreground">Remember your preferences and settings</p>
                  </div>
                  <Switch
                    checked={preferences.functional}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, functional: checked }))
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                onClick={rejectAll}
                className="flex-1"
              >
                Reject All
              </Button>
              {showSettings && (
                <Button
                  variant="outline"
                  onClick={acceptSelected}
                  className="flex-1"
                >
                  Save Preferences
                </Button>
              )}
              <Button
                onClick={acceptAll}
                className="flex-1"
              >
                Accept All
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              View our{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              {' '}and{' '}
              <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>
              {' '}for more information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookieConsent;
