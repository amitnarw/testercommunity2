'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

export function ShowcaseLayout({
  leftPanel,
  rightPanel,
}: {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}) {
  const [rightPanelWidth, setRightPanelWidth] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRightPanelWidth(Math.min(window.innerWidth / 2.5, 500));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      const minWidth = 320;
      const maxWidth = containerRect.width - 400;

      if (newWidth > minWidth && newWidth < maxWidth) {
        setRightPanelWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (rightPanelWidth === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading Layout...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div className="flex-1 min-w-0">{leftPanel}</div>
      <div
        className="w-1.5 cursor-col-resize bg-border hover:bg-primary/20 transition-colors"
        onMouseDown={handleMouseDown}
      />
      <div style={{ width: `${rightPanelWidth}px` }}>{rightPanel}</div>
    </div>
  );
}
