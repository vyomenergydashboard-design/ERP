import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TableHorizontalScrollbar
 * 
 * Custom, high-precision horizontal scrollbar for the Master Orders Table.
 * - Enforces a compact, small draggable thumb (dragger) that does not stretch across half the screen.
 * - Provides thick, easy-to-grab 15px scrollbar track with dark blue styling.
 * - Perfectly synchronized with native trackpad, mouse wheel, and arrow scrolling.
 */
export default function TableHorizontalScrollbar({ containerRef }) {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(true);

  // Compact dragger pill width (small, sleek handle)
  const DRAGGER_WIDTH = 80;

  // Update thumb position based on container.scrollLeft
  const updateThumbPosition = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!container || !track || !thumb) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const trackWidth = track.clientWidth;
    const maxThumbLeft = Math.max(0, trackWidth - DRAGGER_WIDTH);

    if (maxScroll <= 1) {
      thumb.style.display = 'none';
      return;
    }

    thumb.style.display = 'block';
    const ratio = Math.max(0, Math.min(1, container.scrollLeft / maxScroll));
    const thumbLeft = ratio * maxThumbLeft;
    thumb.style.transform = `translateX(${thumbLeft}px)`;
  }, [containerRef]);

  // Sync with container scrolling and resizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateThumbPosition();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    let resizeObserver = null;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        updateThumbPosition();
      });
      resizeObserver.observe(container);
      if (container.firstElementChild) {
        resizeObserver.observe(container.firstElementChild);
      }
    }

    window.addEventListener('resize', updateThumbPosition);
    // Initial call
    updateThumbPosition();
    // Also retry after render ticks
    const t1 = setTimeout(updateThumbPosition, 50);
    const t2 = setTimeout(updateThumbPosition, 250);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateThumbPosition);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [containerRef, updateThumbPosition]);

  // Mouse Dragging on Thumb
  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = container.scrollLeft;
    setIsActive(true);
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const trackWidth = track.clientWidth;
      const maxThumbLeft = Math.max(1, trackWidth - DRAGGER_WIDTH);

      const deltaX = moveEvent.clientX - dragStartXRef.current;
      const scrollDelta = (deltaX / maxThumbLeft) * maxScroll;
      const nextScroll = Math.max(0, Math.min(maxScroll, dragStartScrollLeftRef.current + scrollDelta));
      container.scrollLeft = nextScroll;

      // Update thumb position directly during drag
      const thumb = thumbRef.current;
      if (thumb) {
        const ratio = maxScroll > 0 ? nextScroll / maxScroll : 0;
        thumb.style.transform = `translateX(${ratio * maxThumbLeft}px)`;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsActive(false);
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Track Click (jump toward click position)
  const handleTrackClick = (e) => {
    if (e.target === thumbRef.current || thumbRef.current?.contains(e.target)) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const trackWidth = track.clientWidth;
    const maxThumbLeft = Math.max(1, trackWidth - DRAGGER_WIDTH);

    const targetThumbLeft = clickX - DRAGGER_WIDTH / 2;
    const ratio = Math.max(0, Math.min(1, targetThumbLeft / maxThumbLeft));
    container.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' });
  };

  // Arrow Buttons (Step scroll left/right)
  const handleStepLeft = (e) => {
    e.preventDefault();
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const handleStepRight = (e) => {
    e.preventDefault();
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="table-custom-horizontal-scrollbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 15,
        minHeight: 15,
        maxHeight: 15,
        background: 'var(--table-scrollbar-track, #e2e8f0)',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
        position: 'relative',
        zIndex: 25
      }}
    >
      {/* Left Arrow Button */}
      <button
        type="button"
        onClick={handleStepLeft}
        title="Scroll Left"
        className="table-scrollbar-arrow-btn"
        style={{
          width: 18,
          height: 15,
          border: 'none',
          background: 'transparent',
          color: 'var(--text2, #475569)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <ChevronLeft size={12} strokeWidth={2.5} />
      </button>

      {/* Scrollable Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        style={{
          flex: 1,
          height: '100%',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        {/* Draggable Thumb / Pill */}
        <div
          ref={thumbRef}
          onMouseDown={handleThumbMouseDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="table-scrollbar-thumb"
          style={{
            position: 'absolute',
            top: 2,
            left: 0,
            width: DRAGGER_WIDTH,
            height: 11,
            borderRadius: 999,
            backgroundColor: isActive
              ? 'var(--table-scrollbar-active, #0f172a)'
              : isHovered
              ? 'var(--table-scrollbar-hover, #1d4ed8)'
              : 'var(--table-scrollbar-thumb, #1e3a8a)',
            cursor: isActive ? 'grabbing' : 'grab',
            transition: isActive ? 'background-color 0.15s ease' : 'transform 0.05s linear, background-color 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}
          title="Drag to scroll table horizontally"
        />
      </div>

      {/* Right Arrow Button */}
      <button
        type="button"
        onClick={handleStepRight}
        title="Scroll Right"
        className="table-scrollbar-arrow-btn"
        style={{
          width: 18,
          height: 15,
          border: 'none',
          background: 'transparent',
          color: 'var(--text2, #475569)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <ChevronRight size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}

