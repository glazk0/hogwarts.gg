export function setLastIFrameHref(pathname: string) {
  localStorage.setItem('lastIFramePathname', pathname);
}

export function getLastIFrameHref() {
  return localStorage.getItem('lastIFramePathname') || '/en/map/hogwarts';
}
