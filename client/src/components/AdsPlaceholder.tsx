import React from 'react';

/**
 * CONFIGURATION: Update these IDs to your own Google Analytics and AdSense IDs
 */
export const TRACKING_CONFIG = {
  GA_MEASUREMENT_ID: "G-F01RDVPV12", 
  ADSENSE_CLIENT_ID: "ca-pub-8391664122943087", 
};

/**
 * AdSense Slot IDs
 * Update these if you want specific slots to use specific ad unit IDs
 */
export const AD_SLOTS = {
  HOME_SIDEBAR_TOP: "1234567890",
  HOME_SIDEBAR_BOTTOM: "0987654321",
  DEFAULT: "default"
};

export const AdsPlaceholder: React.FC<{ className?: string, slot?: string }> = ({ className, slot = AD_SLOTS.DEFAULT }) => {
  return (
    <div 
      className={`bg-black/5 border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center p-4 min-h-[150px] overflow-hidden ${className}`}
      data-ad-slot={slot}
    >
      <div className="text-center opacity-30">
        <p className="text-[10px] uppercase tracking-widest font-bold mb-1">AdSense Unit</p>
        <p className="text-[8px] font-mono">Slot: {slot}</p>
        {/* Actual AdSense code would be injected here in production */}
        {/* 
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client={TRACKING_CONFIG.ADSENSE_CLIENT_ID}
               data-ad-slot={slot}
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        */}
      </div>
    </div>
  );
};
