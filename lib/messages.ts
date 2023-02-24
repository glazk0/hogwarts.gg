export function postMessage(message: { type: string; [key: string]: any }) {
  window.top!.postMessage(message, '*');
}
