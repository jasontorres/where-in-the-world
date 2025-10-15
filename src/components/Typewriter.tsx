import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  enableSound?: boolean;
}

// Global audio instance - shared across all Typewriter components
let globalAudio: HTMLAudioElement | null = null;

const getAudio = () => {
  if (!globalAudio) {
    globalAudio = new Audio('/typewriter-sound.mp3');
    globalAudio.volume = 0.3;
    globalAudio.playbackRate = 1.8;
    globalAudio.preload = 'auto';
    globalAudio.loop = true; // Loop for continuous typing sound
  }
  return globalAudio;
};

const Typewriter = ({ text, speed = 10, onComplete, className = "", enableSound = true }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const isTypingRef = useRef(false);

  // Start/stop audio based on typing state
  useEffect(() => {
    if (enableSound) {
      const audio = getAudio();
      
      if (currentIndex < text.length && !isComplete) {
        // Start playing if not already
        if (!isTypingRef.current) {
          isTypingRef.current = true;
          audio.play().catch(() => {});
        }
      } else {
        // Stop playing when done
        if (isTypingRef.current) {
          isTypingRef.current = false;
          audio.pause();
          audio.currentTime = 0;
        }
      }
    }
  }, [currentIndex, text.length, isComplete, enableSound]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <div className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">▊</span>}
    </div>
  );
};

export default Typewriter;
