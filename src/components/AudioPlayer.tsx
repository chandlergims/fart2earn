'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset states when src changes
    setIsPlaying(false);
    setCurrentTime(0);
    setLoading(true);
    setError(null);

    // Set up event listeners
    const setAudioData = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      console.error('Audio error:', audio.error);
      setError('Failed to load audio');
      setIsPlaying(false);
      setLoading(false);
    };

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Clean up event listeners
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || loading || error) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Reset error state when trying to play
      setError(null);
      
      // Try to play and handle any errors
      audio.play().catch(err => {
        console.error('Play error:', err);
        setError('Failed to play audio');
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return (currentTime / duration) * 100 || 0;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio || loading || error) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  // Determine if the URL is a Firebase Storage URL
  const isFirebaseUrl = src.includes('firebasestorage.googleapis.com');

  return (
    <div className={`bg-[#363636] rounded-lg p-3 border border-[#444] ${className}`}>
      <audio 
        ref={audioRef} 
        src={src} 
        preload="metadata" 
        crossOrigin={isFirebaseUrl ? "anonymous" : undefined}
      />
      
      {title && (
        <div className="text-sm text-[#e7d61b] mb-2 truncate">{title}</div>
      )}
      
      {error && (
        <div className="text-red-500 text-xs mb-2">{error}</div>
      )}
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={togglePlayPause}
          disabled={loading || !!error}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            loading || error
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-[#e7d61b] text-black hover:bg-[#c9ba17] cursor-pointer'
          }`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
            </svg>
          )}
        </button>
        
        <div className="flex-grow">
          <div 
            ref={progressBarRef}
            className={`h-3 bg-[#2a2a2a] rounded-full relative border border-[#444] ${loading || error ? 'opacity-50' : 'cursor-pointer'}`}
            onClick={!loading && !error ? handleProgressClick : undefined}
          >
            <div 
              className="h-full bg-[#e7d61b] rounded-full absolute top-0 left-0"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
