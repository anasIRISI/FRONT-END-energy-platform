import { useState, useEffect } from 'react';

/**
 * Hook pour détecter les media queries
 * @param {string} query - Media query CSS (ex: '(max-width: 768px)')
 * @returns {boolean} - true si la media query correspond
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback pour anciens navigateurs
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * Hook pour détecter si on est sur mobile
 */
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

/**
 * Hook pour détecter si on est sur tablette
 */
export const useIsTablet = () => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
};

/**
 * Hook pour détecter si on est sur desktop
 */
export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1025px)');
};

export default useMediaQuery;
