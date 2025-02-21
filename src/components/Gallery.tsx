import React, { useState, useEffect, useRef } from 'react';
import { Screenshot } from '../lib/types';

interface GalleryProps {
  screenshots: Screenshot[];
  videoUrl?: string | null;
  isMuted?: boolean;
  showControls?: boolean;
}

export default function Gallery({ screenshots = [], videoUrl, isMuted = true }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [items, setItems] = useState<Array<{ type: 'video' | 'image'; url?: string; path_thumbnail?: string }>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number>();

  // Create items array with video and screenshots, capped at 10 items
  useEffect(() => {
    const newItems = [
      ...(videoUrl && !videoError ? [{ type: 'video', url: videoUrl }] : []),
      ...(screenshots || []).slice(0, videoUrl && !videoError ? 9 : 10).map(s => ({ type: 'image', path_thumbnail: s.path_thumbnail }))
    ];
    setItems(newItems);
  }, [videoUrl, videoError, screenshots]);

  // Reset index and video error when items change
  useEffect(() => {
    setCurrentIndex(0);
    setVideoError(false);
  }, [videoUrl, screenshots?.length]);

  // Handle auto-advance timer
  useEffect(() => {
    const startTimer = () => {
      // Clear any existing timer
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      // Only start timer for images
      const currentItem = items[currentIndex];
      if (currentItem?.type === 'image') {
        timerRef.current = window.setTimeout(() => {
          // Loop back to first item if we're at the end
          setCurrentIndex(prev => (prev + 1) % items.length);
        }, 10000); // 10 seconds
      }
    };

    startTimer();

    // Cleanup timer on unmount or when index/items change
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, items]);

  // Handle video errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    
    // Only log and handle fatal errors
    if (video.error?.code) {
      console.warn('Video playback error:', {
        code: video.error.code,
        message: video.error.message,
        url: videoUrl
      });
      setVideoError(true);
      
      // If we have screenshots, switch to the first one
      if (screenshots?.length > 0) {
        setCurrentIndex(0);
      }
    }
  };

  // Handle video stalling
  const handleVideoStalled = () => {
    if (videoRef.current) {
      // Attempt to recover by reloading the video
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // If recovery fails, switch to screenshots
        setVideoError(true);
      });
    }
  };

  // Handle video ending
  const handleVideoEnded = () => {
    // Loop back to first item if we're at the end
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  // Handle manual navigation
  const handleIndicatorClick = (index: number) => {
    // Clear any existing timer when user manually navigates
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setCurrentIndex(index);
  };

  // Handle center area click
  const handleCenterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear any existing timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    // Advance to next item with loop
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  // If no items, show nothing
  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];
  if (!currentItem) {
    return null;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-content">
        <div className="gallery-center-area" onClick={handleCenterClick}>
          <div className="gallery-media-wrapper">
            {currentItem.type === 'video' ? (
              <video
                ref={videoRef}
                src={currentItem.url}
                autoPlay
                muted={isMuted}
                playsInline
                className="gallery-media"
                onError={handleVideoError}
                onStalled={handleVideoStalled}
                onEnded={handleVideoEnded}
              />
            ) : (
              <img
                src={currentItem.path_thumbnail}
                alt=""
                className="gallery-media"
              />
            )}
          </div>
        </div>

        {items.length > 1 && (
          <div className="gallery-indicators">
            {items.map((_, index) => (
              <div
                key={index}
                className={`gallery-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleIndicatorClick(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
