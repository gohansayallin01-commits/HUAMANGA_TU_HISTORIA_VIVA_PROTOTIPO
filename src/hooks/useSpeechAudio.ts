import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);
  const estimatedDurationRef = useRef<number>(30); // segundos estimados

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  }, []);

  const play = useCallback((text: string, lang: string = 'es') => {
    stop();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : 'es-PE';
      utterance.rate = 0.95; // ritmo pausado y claro
      utterance.pitch = 1.0;

      // Estimar duración aproximada en segundos (promedio 3 palabras por segundo)
      const wordCount = text.split(/\s+/).length;
      const durationSeconds = Math.max(10, Math.round(wordCount / 2.5));
      estimatedDurationRef.current = durationSeconds;

      let elapsedSeconds = 0;
      timerRef.current = setInterval(() => {
        elapsedSeconds += 0.5;
        const pct = Math.min(100, Math.round((elapsedSeconds / durationSeconds) * 100));
        setProgress(pct);
        if (pct >= 100) {
          stop();
        }
      }, 500);

      utterance.onend = () => {
        stop();
      };

      utterance.onerror = () => {
        stop();
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // Simulación visual si el navegador no tiene síntesis
      setIsPlaying(true);
      let p = 0;
      timerRef.current = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 100) {
          stop();
        }
      }, 500);
    }
  }, [stop]);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    setIsPlaying(true);
    setIsPaused(false);

    // Reiniciar temporizador de progreso
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          stop();
          return 100;
        }
        return prev + 2;
      });
    }, 500);
  }, [stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isPlaying,
    isPaused,
    progress,
    play,
    pause,
    resume,
    stop,
  };
}
