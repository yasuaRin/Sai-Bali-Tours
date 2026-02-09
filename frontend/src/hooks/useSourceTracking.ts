import { useEffect } from 'react';

const SOURCE_COOKIE_NAME = 'initial_traffic_source';
const COOKIE_EXPIRY_DAYS = 90;

export interface SourceData {
  landing_page: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer_domain: string | null;
  timestamp: string;
}

export function useSourceTracking(): void {
  useEffect(() => {
    const existingCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${SOURCE_COOKIE_NAME}=`));

    if (!existingCookie) {
      const landingPage = window.location.pathname + window.location.search;
      const referrer = document.referrer;
      
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get('utm_source');
      const utm_medium = urlParams.get('utm_medium');
      const utm_campaign = urlParams.get('utm_campaign');

      const sourceData: SourceData = {
        landing_page: landingPage,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer_domain: referrer ? new URL(referrer).hostname : null,
        timestamp: new Date().toISOString()
      };

      const cookieValue = encodeURIComponent(JSON.stringify(sourceData));
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

      document.cookie = `${SOURCE_COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    }
  }, []);
}