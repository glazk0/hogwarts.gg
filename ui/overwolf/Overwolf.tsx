'use client';

import Script from 'next/script';
import Status from './Status';

const isOverwolfIframe =
  window.top && navigator.userAgent.includes('OverwolfClient');

export default function Overwolf() {
  if (!isOverwolfIframe) {
    return <></>;
  }
  return (
    <div className="pt-14 w-[401px] h-full flex flex-col border-l border-gray-800">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js" />
      <div className="flex-1 border-b border-gray-800 overflow-auto">
        <Status />
      </div>
      <div
        className={`w-[400px] h-[300px] bg-gray-900 bg-[url('/assets/ads-bg.jpg')] bg-cover bg-center bg-no-repeat grayscale brightness-75`}
      >
        {/* Reserved for Overwolf ads */}
      </div>
    </div>
  );
}
