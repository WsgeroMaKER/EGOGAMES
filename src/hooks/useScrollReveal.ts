import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver-based scroll reveal hook.
 * Adds the `is-visible` class to elements with the `reveal` class when
 * they enter the viewport. Returns a ref to attach to a container element;
 * all descendant `.reveal` elements are observed.
 *
 * Uses a MutationObserver to catch dynamically added `.reveal` elements
 * (e.g. when a hidden section becomes visible after navigation).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            intersectionObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    const observeAll = () => {
      const elements = container.querySelectorAll<HTMLElement>('.reveal');
      elements.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          intersectionObserver.observe(el);
        }
      });
    };

    observeAll();

    // Watch for dynamically added/removed elements
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return containerRef;
}
