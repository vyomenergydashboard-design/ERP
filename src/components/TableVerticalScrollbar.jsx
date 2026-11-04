import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * TableVerticalScrollbar
 * 
 * Custom, high-precision vertical scrollbar for the Master Orders Table.
 * - Enforces a compact, small draggable thumb (dragger) that does not stretch across the whole table height.
 * - Sleek 12px width with dark blue pill styling.
 * - Perfectly synchronized with native mouse wheel, trackpad, and keyboard scrolling.
 */
export default function TableVerticalScrollbar({ containerRef }) {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartScrollTopRef = useRef(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Compact dragger pill height (small, sleek handle)
  const DRAGGER_HEIGHT = 60;
  const TRACK_WIDTH = 12;

  // Update thumb position based on container.scrollTop
  const updateThumbPosition = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!container || !track || !thumb) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    const trackHeight = track.clientHeight;
    const maxThumbTop = Math.max(0, trackHeight - DRAGGER_HEIGHT);

    if (maxScroll <= 1) {
      thumb.style.display = 'none';
      return;
    }

    thumb.style.display = 'block';
    const ratio = Math.max(0, Math.min(1, container.scrollTop / maxScroll));
    const thumbTop = ratio * maxThumbTop;
    thumb.style.transform = `translateY(${thumbTop}px)`;
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
    updateThumbPosition();
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
    dragStartYRef.current = e.clientY;
    dragStartScrollTopRef.current = container.scrollTop;
    setIsActive(true);
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const trackHeight = track.clientHeight;
      const maxThumbTop = Math.max(1, trackHeight - DRAGGER_HEIGHT);

      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
      const nextScroll = Math.max(0, Math.min(maxScroll, dragStartScrollTopRef.current + scrollDelta));
      container.scrollTop = nextScroll;

      const thumb = thumbRef.current;
      if (thumb) {
        const ratio = maxScroll > 0 ? nextScroll / maxScroll : 0;
        thumb.style.transform = `translateY(${ratio * maxThumbTop}px)`;
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
    const clickY = e.clientY - rect.top;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const trackHeight = track.clientHeight;
    const maxThumbTop = Math.max(1, trackHeight - DRAGGER_HEIGHT);

    const targetThumbTop = clickY - DRAGGER_HEIGHT / 2;
    const ratio = Math.max(0, Math.min(1, targetThumbTop / maxThumbTop));
    container.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' });
  };

  // Step Up / Down buttons
  const handleStepUp = (e) => {
    e.preventDefault();
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: -150, behavior: 'smooth' });
    }
  };

  const handleStepDown = (e) => {
    e.preventDefault();
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: 150, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="table-custom-vertical-scrollbar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: TRACK_WIDTH,
        minWidth: TRACK_WIDTH,
        maxWidth: TRACK_WIDTH,
        height: '100%',
        background: 'var(--table-scrollbar-track, #e2e8f0)',
        borderLeft: '1px solid var(--border)',
        flexShrink: 0,
        boxSizing: 'border-box',
        userSelect: 'none',
        position: 'relative',
        zIndex: 25
      }}
    >
      {/* Up Arrow Button */}
      <button
        type="button"
        onClick={handleStepUp}
        title="Scroll Up"
        className="table-scrollbar-arrow-btn"
        style={{
          width: TRACK_WIDTH,
          height: 14,
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
        <ChevronUp size={9} strokeWidth={2.5} />
      </button>

      {/* Scrollable Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        style={{
          flex: 1,
          width: '100%',
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
            top: 0,
            left: 2,
            width: TRACK_WIDTH - 4,
            height: DRAGGER_HEIGHT,
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
          title="Drag to scroll table vertically"
        />
      </div>

      {/* Down Arrow Button */}
      <button
        type="button"
        onClick={handleStepDown}
        title="Scroll Down"
        className="table-scrollbar-arrow-btn"
        style={{
          width: TRACK_WIDTH,
          height: 14,
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
        <ChevronDown size={9} strokeWidth={2.5} />
      </button>
    </div>
  );
}

