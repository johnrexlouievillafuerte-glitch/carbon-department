import { useEffect, useState } from 'react';

function read(): string {
  const raw = window.location.hash.replace(/^#/, '');
  return raw || '/';
}

export function navigate(to: string): void {
  if (read() === to) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.location.hash = to;
  window.scrollTo({ top: 0 });
}

export function useRoutePath(): string {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const onHash = () => setPath(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return path;
}

export function parsePath(path: string): { pathname: string; params: URLSearchParams } {
  const [pathname, qs] = path.split('?');
  return { pathname: pathname || '/', params: new URLSearchParams(qs ?? '') };
}
