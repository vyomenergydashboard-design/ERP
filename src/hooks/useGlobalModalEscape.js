import { useEffect } from 'react';

/**
 * Global keyboard listener to close the active / topmost modal when pressing Escape.
 * Supports:
 * - .modal-overlay.open (used throughout the ERP application)
 * - .bim-overlay (Bulk import modal)
 * - [data-modal="open"], [data-modal-overlay], dialog[open] (standard / future modals)
 *
 * Stacking:
 * If multiple modals/dialogs are open, only the topmost modal (highest z-index / latest in DOM)
 * is closed. If no modal is open, Escape has no effect.
 */
export function useGlobalModalEscape() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;

      // Find all open modal overlays currently attached and visible in the document
      const selector = '.modal-overlay.open, .bim-overlay, [data-modal="open"], [data-modal-overlay], dialog[open]';
      const openOverlays = Array.from(document.querySelectorAll(selector)).filter((el) => {
        if (!el.isConnected) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });

      // If no modals are open, preserve default application behavior
      if (openOverlays.length === 0) return;

      // Prevent default and stop propagation so Escape doesn't trigger actions behind the modal
      e.preventDefault();
      e.stopPropagation();

      // Determine the topmost modal (highest computed z-index, or latest in DOM tree if z-index is equal)
      let topOverlay = openOverlays[0];
      let maxZ = -Infinity;

      for (const el of openOverlays) {
        const parsedZ = parseInt(window.getComputedStyle(el).zIndex, 10);
        const z = isNaN(parsedZ) ? 0 : parsedZ;
        if (z >= maxZ) {
          maxZ = z;
          topOverlay = el;
        }
      }

      // Find the close button inside the topmost modal
      const closeBtn = topOverlay.querySelector(
        '.modal-close, .bim-close, [data-modal-close], button[aria-label="Close"], button[aria-label="close"]'
      ) || topOverlay.querySelector(
        '.btn-cancel, button.btn-secondary, [data-action="cancel"]'
      );

      if (closeBtn) {
        closeBtn.click();
      } else {
        // Fallback: simulate click on the overlay itself if it handles click-outside-to-close
        topOverlay.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}

export default useGlobalModalEscape;
