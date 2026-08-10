"use client";

import { useEffect, useRef, useState } from "react";

export function ProdukGambarSlider({
  urls = [],
  enableFullscreen = false,
  onFullscreenChange,
}: {
  urls?: string[];
  enableFullscreen?: boolean;
  onFullscreenChange?: (open: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isFullscreen || !urls || urls.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % urls.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, isFullscreen, urls?.length]);

  function goNext() {
    setIndex((prev) => (prev + 1) % urls.length);
  }

  function goPrev() {
    setIndex((prev) => (prev - 1 + urls.length) % urls.length);
  }

  function openFullscreen() {
    if (!enableFullscreen) return;
    setIsFullscreen(true);
    onFullscreenChange?.(true);
  }

  function closeFullscreen() {
    setIsFullscreen(false);
    onFullscreenChange?.(false);
  }

  function handleTouchStart(e: React.TouchEvent) {
    dragStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = dragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    diff > 0 ? goNext() : goPrev();
  }

  function handleMouseDown(e: React.MouseEvent) {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) < 50) return;
    diff > 0 ? goNext() : goPrev();
  }

  function handleMouseLeave() {
    isDragging.current = false;
  }

  if (!urls || urls.length === 0) return null;

  return (
    <>
      <div
        ref={ref}
        className="w-full h-full relative overflow-hidden cursor-pointer"
        onClick={openFullscreen}
      >
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {urls.map((url, i) => (
            <img
              key={i}
              src={url}
              loading="lazy"
              className="w-full h-full object-cover shrink-0"
            />
          ))}
        </div>

        {urls.length > 1 && (
          <div className="absolute bottom-2 flex gap-1 z-10">
            {urls.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          <img
            src={urls[index]}
            className="max-w-full max-h-full object-contain select-none cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            draggable={false}
          />

          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeFullscreen}
          >
            ✕
          </button>

          {urls.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {urls.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
