
import React from 'react';
import AdUnit from './AdUnit';
import { cn } from '@/lib/utils';

interface InFeedAdProps {
  slot: string;
  className?: string;
}

const InFeedAd: React.FC<InFeedAdProps> = ({ slot, className }) => {
  return (
    <div className={cn("py-4", className)}>
      <AdUnit
        slot={slot}
        format="fluid"
        fullWidthResponsive
        className="w-full"
      />
    </div>
  );
};

export default InFeedAd;
