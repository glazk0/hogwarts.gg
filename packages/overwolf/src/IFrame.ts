import { communicate } from './lib/messages';

export default function IFrame() {
  const iframe = document.createElement('iframe');
  iframe.src = import.meta.env.VITE_APP_WEB;
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';

  document.body.append(iframe);
  communicate(iframe);
}
