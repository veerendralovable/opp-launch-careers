
import React, { useRef, useEffect } from 'react';
import { useAdsense } from '@/hooks/useAdsense';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

const AdUnit: React.FC<AdUnitProps> = ({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className,
  fallback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canShowAds, isBlocked, initializeAd, testMode } = useAdsense();

  useEffect(() => {
    if (containerRef.current && canShowAds && !testMode) {
      initializeAd(containerRef.current, {
        adSlot: slot,
        adFormat: format,
        fullWidthResponsive,
      });
    }
  }, [canShowAds, slot, format, fullWidthResponsive, initializeAd, testMode]);

  // Test mode placeholder
  if (testMode) {
    return (
      <div
        className={cn(
          "bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 flex items-center justify-center text-muted-foreground text-sm",
          className
        )}
        style={{ minHeight: format === 'rectangle' ? '250px' : '90px' }}
      >
        <div className="text-center">
          <p className="font-medium">Ad Placeholder</p>
          <p className="text-xs">Slot: {slot}</p>
          <p className="text-xs">Format: {format}</p>
        </div>
      </div>
    );
  }

  // Ad blocked fallback
  if (isBlocked && fallback) {
    return <>{fallback}</>;
  }

  // Can't show ads (no consent or blocked)
  if (!canShowAds) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn("ad-container", className)}
      style={{ minHeight: format === 'rectangle' ? '250px' : '90px' }}
    />
  );
};

export default AdUnit;
