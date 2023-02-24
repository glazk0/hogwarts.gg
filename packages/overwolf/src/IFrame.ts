import { getLastIFrameHref } from './lib/storage';

const BASE_URL = import.meta.env.VITE_APP_WEB || 'https://www.hogwarts.gg';
export default function IFrame() {
  const iframe = document.querySelector<HTMLIFrameElement>('.iframe')!;
  iframe.src = BASE_URL + getLastIFrameHref();
  return iframe;
}
