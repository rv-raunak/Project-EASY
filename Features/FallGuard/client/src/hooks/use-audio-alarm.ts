import React, { useState, useCallback, useRef } from 'react';

interface AudioAlarmSettings {
  volume: number;
  vibration: boolean;
}

export function useAudioAlarm(settings: AudioAlarmSettings) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const createAlarmSound = useCallback(() => {
    // Create audio context if it doesn't exist
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    
    // Create oscillator for alarm sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure alarm sound (alternating frequencies for urgency)
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    // Create alternating frequency pattern
    const pattern = [800, 1000, 800, 1000];
    let time = audioContext.currentTime;
    
    pattern.forEach((freq, index) => {
      oscillator.frequency.setValueAtTime(freq, time + index * 0.5);
    });
    
    // Set volume
    gainNode.gain.setValueAtTime(settings.volume / 100, audioContext.currentTime);
    
    return { oscillator, gainNode };
  }, [settings.volume]);

  const startAlarm = useCallback(() => {
    if (isPlaying) return;

    try {
      const { oscillator, gainNode } = createAlarmSound();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      oscillator.start();
      setIsPlaying(true);

      // Vibrate if supported and enabled
      if (settings.vibration && 'vibrate' in navigator) {
        // Vibrate in pattern: 200ms on, 100ms off, repeat
        const vibratePattern = [200, 100, 200, 100, 200, 100, 200, 100];
        const vibrateInterval = setInterval(() => {
          navigator.vibrate(vibratePattern);
        }, 1000);

        // Store vibration interval for cleanup
        (oscillator as any).vibrateInterval = vibrateInterval;
      }
    } catch (error) {
      console.error('Failed to start alarm:', error);
    }
  }, [isPlaying, createAlarmSound, settings.vibration]);

  const stopAlarm = useCallback(() => {
    try {
      console.log('Stopping alarm...');
      
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          console.log('Oscillator already stopped');
        }
        
        // Clear vibration
        if ((oscillatorRef.current as any).vibrateInterval) {
          clearInterval((oscillatorRef.current as any).vibrateInterval);
        }
        
        oscillatorRef.current = null;
        gainNodeRef.current = null;
      }

      // Stop any ongoing vibration
      if ('vibrate' in navigator) {
        navigator.vibrate(0);
      }

      setIsPlaying(false);
      console.log('Alarm stopped successfully');
    } catch (error) {
      console.error('Failed to stop alarm:', error);
      setIsPlaying(false); // Force stop playing state
    }
  }, []);

  const testAlarm = useCallback(() => {
    if (isPlaying) {
      stopAlarm();
    } else {
      startAlarm();
      
      // Auto-stop after 3 seconds for testing
      setTimeout(() => {
        stopAlarm();
      }, 3000);
    }
  }, [isPlaying, startAlarm, stopAlarm]);

  return {
    isPlaying,
    startAlarm,
    stopAlarm,
    testAlarm,
    triggerAlarm: startAlarm, // Alias for backwards compatibility
  };
}
