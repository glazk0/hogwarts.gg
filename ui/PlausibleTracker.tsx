'use client';

import { initPlausible } from '#/lib/plausible';
import { useEffect } from 'react';

const PlausibleTracker = () => {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN &&
      process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST
    ) {
      initPlausible(
        process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
        process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST,
      );
    }
  }, []);

  return null;
};
export default PlausibleTracker;
