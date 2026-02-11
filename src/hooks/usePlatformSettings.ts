
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlatformSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*');

      if (error) throw error;
      
      const settingsMap = (data || []).reduce((acc, setting) => {
        // value is stored as JSON string, parse it
        const val = setting.value;
        acc[setting.key] = typeof val === 'string' ? val : JSON.stringify(val);
        return acc;
      }, {} as Record<string, string>);
      
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          key,
          value: value as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setSettings(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Setting Updated",
        description: `${key} has been updated successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSetting = useCallback((key: string, fallback: string = '') => {
    const val = settings[key];
    if (!val) return fallback;
    return val;
  }, [settings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    updateSetting,
    getSetting,
    refetch: fetchSettings
  };
};
