import type { OwAd } from '@overwolf/types/owads';

declare global {
  interface Window {
    OwAd?: typeof OwAd;
  }
}

export default function Ads() {
  function onOwAdReady() {
    if (typeof window.OwAd === 'undefined') {
      return;
    }

    const div = document.createElement('div');
    div.className = 'ads';
    document.body.append(div);

    new window.OwAd(div, {
      size: { width: 400, height: 300 },
    });
  }
  const script = document.createElement('script');
  script.src = 'https://content.overwolf.com/libs/ads/latest/owads.min.js';
  script.async = true;
  script.onload = onOwAdReady;
  return script;
}
