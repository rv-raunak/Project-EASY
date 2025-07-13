import React, { useState, useEffect, useCallback } from 'react';

interface MotionData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

interface MotionSensorState {
  isSupported: boolean;
  hasPermission: boolean;
  isActive: boolean;
  motionData: MotionData | null;
  error: string | null;
}

export function useMotionSensor() {
  const [state, setState] = useState<MotionSensorState>({
    isSupported: false,
    hasPermission: false,
    isActive: false,
    motionData: null,
    error: null,
  });

  const [motionHistory, setMotionHistory] = useState<MotionData[]>([]);

  useEffect(() => {
    // Check if DeviceMotionEvent is supported
    const isSupported = 'DeviceMotionEvent' in window;
    setState(prev => ({ ...prev, isSupported }));

    if (!isSupported) {
      setState(prev => ({ ...prev, error: 'Device motion sensors are not supported on this device' }));
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Motion sensors not supported' }));
      return false;
    }

    try {
      // For iOS 13+ devices, we need to request permission
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setState(prev => ({ ...prev, hasPermission: true, error: null }));
          return true;
        } else {
          setState(prev => ({ 
            ...prev, 
            hasPermission: false, 
            error: 'Motion sensor permission denied' 
          }));
          return false;
        }
      } else {
        // For other devices, assume permission is granted
        setState(prev => ({ ...prev, hasPermission: true, error: null }));
        return true;
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        hasPermission: false, 
        error: 'Failed to request motion sensor permission' 
      }));
      return false;
    }
  }, [state.isSupported]);

  const startMonitoring = useCallback(() => {
    if (!state.isSupported || !state.hasPermission) {
      return;
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const motionData: MotionData = {
          x: event.accelerationIncludingGravity.x || 0,
          y: event.accelerationIncludingGravity.y || 0,
          z: event.accelerationIncludingGravity.z || 0,
          timestamp: Date.now(),
        };

        setState(prev => ({ ...prev, motionData }));
        
        // Keep history of last 50 readings for fall detection
        setMotionHistory(prev => {
          const newHistory = [...prev, motionData];
          return newHistory.slice(-50);
        });

        // Debug logging for high motion
        const magnitude = Math.sqrt(motionData.x * motionData.x + motionData.y * motionData.y + motionData.z * motionData.z);
        if (magnitude > 25) {
          console.log('High Motion Detected:', {
            x: motionData.x.toFixed(2),
            y: motionData.y.toFixed(2),
            z: motionData.z.toFixed(2),
            magnitude: magnitude.toFixed(2)
          });
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    setState(prev => ({ ...prev, isActive: true }));

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      setState(prev => ({ ...prev, isActive: false }));
    };
  }, [state.isSupported, state.hasPermission]);

  const stopMonitoring = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }));
    setMotionHistory([]);
  }, []);

  return {
    ...state,
    motionHistory,
    requestPermission,
    startMonitoring,
    stopMonitoring,
  };
}
