import { communicate } from './lib/messages';
import { getLastIFrameHref } from './lib/storage';

const BASE_URL = import.meta.env.VITE_APP_WEB || 'https://www.hogwarts.gg';
export default function IFrame() {
  const loadingContainer = document.createElement('div');
  loadingContainer.style.position = 'fixed';
  loadingContainer.style.inset = '0';
  loadingContainer.style.backgroundImage = 'url(/bg.webp)';
  loadingContainer.style.backgroundRepeat = 'no-repeat';
  loadingContainer.style.backgroundSize = 'cover';
  loadingContainer.style.display = 'grid';
  loadingContainer.style.placeItems = 'center';
  const loadingOverlay = document.createElement('img');
  loadingOverlay.src = '/logo.png';
  loadingOverlay.style.height = '100%';
  loadingOverlay.style.width = '100%';
  loadingOverlay.style.maxHeight = '700px';
  loadingOverlay.style.maxWidth = '700px';
  loadingOverlay.style.objectFit = 'contain';
  loadingOverlay.animate(
    [
      { transform: 'scale(0.95)' },
      { transform: 'scale(1)' },
      { transform: 'scale(0.95)' },
    ],
    {
      duration: 2000,
      iterations: Infinity,
      easing: 'ease-in-out',
    },
  );

  loadingContainer.append(loadingOverlay);

  const iframe = document.createElement('iframe');
  iframe.src = BASE_URL + getLastIFrameHref();
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';

  document.body.append(loadingContainer, iframe);
  communicate(iframe, () => {
    loadingContainer.remove();
  });
}
