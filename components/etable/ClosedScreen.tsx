'use client';

import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useStore } from '@/lib/store';

export function ClosedScreen() {
  const { setCurrentScreen } = useStore();
  const [sliderX, setSliderX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxSlide = 280;

  const handleStart = (clientX: number) => {
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(clientX - rect.left - 30, maxSlide));
    setSliderX(newX);
  };

  const handleEnd = () => {
    if (sliderX > maxSlide * 0.8) {
      setCurrentScreen('dashboard');
    } else {
      setSliderX(0);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => handleEnd();
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, sliderX]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-[#FD780F]">E</span>
          <span className="text-[#082752]">TABLE</span>
        </h1>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Icon */}
        <div className="w-28 h-28 rounded-full bg-[#FFF7ED] flex items-center justify-center mb-8">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FD780F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
            <line x1="4" y1="4" x2="20" y2="20" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#082752] mb-4">受付停止中</h2>

        {/* Description */}
        <p className="text-gray-400 text-center text-sm leading-relaxed">
          今日もたくさんのお客様に<br />
          美味しい体験を届けましょう。
        </p>
      </div>

      {/* Slide to Open */}
      <div className="px-6 pb-12">
        <div
          ref={containerRef}
          className="relative bg-gray-100 rounded-full h-16 flex items-center overflow-hidden"
        >
          {/* Background Text */}
          <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">
            スライドして開店
          </span>

          {/* Slider Button */}
          <div
            ref={sliderRef}
            className="absolute left-1 top-1 bottom-1 w-14 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform"
            style={{ transform: `translateX(${sliderX}px)` }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          >
            <Play className="w-6 h-6 text-[#FD780F] fill-[#FD780F]" />
          </div>
        </div>
      </div>
    </div>
  );
}
