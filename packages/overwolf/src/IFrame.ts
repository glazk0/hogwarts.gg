import { communicate } from './lib/messages';
import { getLastIFrameHref } from './lib/storage';

const BASE_URL = import.meta.env.VITE_APP_WEB || 'https://www.hogwarts.gg';
export default function IFrame() {
  const iframe = document.createElement('iframe');
  iframe.src = BASE_URL + getLastIFrameHref();
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';

  document.body.append(iframe);
  communicate(iframe);
}
