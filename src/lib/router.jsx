import { useEffect, useState, useCallback } from 'react';

function currentRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return raw || 'home';
}

export function useHashRoute() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const onChange = () => {
      setRoute(currentRoute());
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to) => {
    window.location.hash = '#/' + String(to).replace(/^#?\/?/, '');
  }, []);

  return [route, navigate];
}

export function Link({ to, children, className, onClick }) {
  return (
    <a href={'#/' + String(to).replace(/^#?\/?/, '')} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
