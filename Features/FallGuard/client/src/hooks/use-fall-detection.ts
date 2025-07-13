import React, { useState, useEffect, useCallback } from 'react';

interface MotionData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

interface FallDetectionSettings {
  sensitivity: 'low' | 'medium' | 'high';
  threshold: number;
}

const SENSITIVITY_THRESHOLDS = {
  low: 50,
  medium: 40,
  high: 30,
};

export function useFallDetection(motionHistory: MotionData[], settings: FallDetectionSettings) {
  const [fallDetected, setFallDetected] = useState(false);
  const [lastFallTime, setLastFallTime] = useState<number | null>(null);

  const calculateMagnitude = useCallback((data: MotionData): number => {
    return Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
  }, []);

  const detectFall = useCallback(() => {
    if (motionHistory.length < 5) return false;

    const recentData = motionHistory.slice(-15);
    const magnitudes = recentData.map(calculateMagnitude);
    
    // Use custom threshold if provided, otherwise use sensitivity-based threshold
    const threshold = settings.threshold || SENSITIVITY_THRESHOLDS[settings.sensitivity];
    const maxMagnitude = Math.max(...magnitudes);
    
    // Calculate acceleration change - look for spikes
    const avgMagnitude = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    const magnitudeSpike = maxMagnitude - avgMagnitude;
    
    // Fall detection: either high absolute magnitude OR significant spike
    const fallDetected = maxMagnitude > threshold || magnitudeSpike > (threshold * 0.5);
    
    // Reduced logging frequency
    if (magnitudes.length > 0 && Math.random() < 0.1) {
      console.log('Fall Detection Debug:', {
        maxMagnitude: maxMagnitude.toFixed(2),
        avgMagnitude: avgMagnitude.toFixed(2),
        magnitudeSpike: magnitudeSpike.toFixed(2),
        threshold: threshold.toFixed(2),
        spikeThreshold: (threshold * 0.5).toFixed(2),
        sensitivity: settings.sensitivity,
        customThreshold: settings.threshold,
        fallDetected
      });
    }
    
    return fallDetected;
  }, [motionHistory, settings.sensitivity, settings.threshold, calculateMagnitude]);

  const resetFallDetection = useCallback(() => {
    setFallDetected(false);
    setLastFallTime(null);
  }, []);

  useEffect(() => {
    if (motionHistory.length > 0) {
      const isFallDetected = detectFall();
      
      if (isFallDetected && !fallDetected) {
        const now = Date.now();
        // Prevent multiple detections within 3 seconds
        if (!lastFallTime || now - lastFallTime > 3000) {
          console.log('FALL DETECTED! Triggering alarm...');
          setFallDetected(true);
          setLastFallTime(now);
        }
      }
    }
  }, [motionHistory, detectFall, fallDetected, lastFallTime]);

  return {
    fallDetected,
    resetFallDetection,
  };
}
