'use client';

import type { Translations } from '#/lib/i18n/types';
import Status from './Status';

const isOverwolfIframe =
  window.top && navigator.userAgent.includes('OverwolfClient');

export default function Overwolf({
  translations,
}: {
  translations: Translations;
}) {
  if (!isOverwolfIframe) {
    return <></>;
  }
  return (
    <div className="pt-14 w-[401px] h-full flex flex-col border-l border-gray-800">
      <div className="flex-1 border-b border-gray-800 overflow-auto">
        <Status translations={translations} />
      </div>
      <div
        className={`w-[400px] h-[300px] bg-gray-900 bg-[url('/assets/ads-bg.jpg')] bg-cover bg-center bg-no-repeat grayscale brightness-75`}
      >
        {/* Reserved for Overwolf ads */}
      </div>
    </div>
  );
}
