'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { ADSENSE_CLIENT, isAdsenseEnabled } from '@/lib/ads';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  className?: string;
  ariaLabel: string;
  fallback: string;
  fallbackClassName?: string;
  style?: CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
}

export default function AdSlot({
  slot,
  className,
  ariaLabel,
  fallback,
  fallbackClassName,
  style,
  format = 'auto',
  fullWidthResponsive = true,
}: AdSlotProps) {
  const pushedRef = useRef(false);
  const enabled = isAdsenseEnabled() && slot.length > 0;

  useEffect(() => {
    if (!enabled || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {}
  }, [enabled]);

  if (!enabled) {
    return (
      <div className={className} data-ad-slot="true" aria-label={ariaLabel}>
        <span className={fallbackClassName}>{fallback}</span>
      </div>
    );
  }

  return (
    <div className={className} data-ad-slot="true" aria-label={ariaLabel}>
      <ins
        className="adsbygoogle"
        style={style ?? { display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
