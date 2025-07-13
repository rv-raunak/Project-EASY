import React, { useState, useEffect } from 'react';
import { Smartphone, Shield, ShieldCheck, AlertTriangle, Settings, Play, Pause, X } from 'lucide-react';
import { useMotionSensor } from '@/hooks/use-motion-sensor';
import { useFallDetection } from '@/hooks/use-fall-detection';
import { useAudioAlarm } from '@/hooks/use-audio-alarm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface AppSettings {
  sensitivity: 'low' | 'medium' | 'high';
  volume: number;
  vibration: boolean;
  customThreshold: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  enableSMS: boolean;
}

export default function FallDetection() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showFallAlert, setShowFallAlert] = useState(false);
  const [graceTimeRemaining, setGraceTimeRemaining] = useState(0);
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    sensitivity: 'medium',
    volume: 80,
    vibration: true,
    customThreshold: 40,
    emergencyContactName: '',
    emergencyContactPhone: '',
    enableSMS: false,
  });

  const motionSensor = useMotionSensor();
  const fallDetection = useFallDetection(motionSensor.motionHistory, {
    sensitivity: settings.sensitivity,
    threshold: settings.customThreshold,
  });
  const audioAlarm = useAudioAlarm({
    volume: settings.volume,
    vibration: settings.vibration,
  });

  // Handle fall detection with grace period
  useEffect(() => {
    if (fallDetection.fallDetected && isMonitoring && !showFallAlert) {
      console.log('FALL DETECTED! Starting grace period...');
      setShowFallAlert(true);
      setGraceTimeRemaining(60); // 60 second grace period
      setSmsStatus('idle');
      audioAlarm.startAlarm();
    }
  }, [fallDetection.fallDetected, isMonitoring, showFallAlert, audioAlarm]);

  // Grace period countdown
  useEffect(() => {
    if (graceTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setGraceTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (graceTimeRemaining === 0 && showFallAlert && settings.enableSMS && smsStatus === 'idle') {
      // Send SMS after grace period expires
      sendEmergencySMS();
    }
  }, [graceTimeRemaining, showFallAlert, settings.enableSMS, smsStatus]);

  const sendEmergencySMS = async () => {
    if (!settings.emergencyContactPhone || !settings.emergencyContactName) {
      console.log('Emergency contact not configured');
      return;
    }

    setSmsStatus('sending');
    
    try {
      const response = await fetch('/api/send-emergency-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: settings.emergencyContactPhone,
          contactName: settings.emergencyContactName,
          message: `EMERGENCY: Fall detected for your contact. They may need assistance. Time: ${new Date().toLocaleString()}`
        })
      });

      if (response.ok) {
        setSmsStatus('sent');
        console.log('Emergency SMS sent successfully');
      } else {
        setSmsStatus('failed');
        console.error('Failed to send emergency SMS');
      }
    } catch (error) {
      setSmsStatus('failed');
      console.error('Error sending emergency SMS:', error);
    }
  };

  const cancelEmergencyAlert = () => {
    console.log('Emergency alert cancelled by user');
    setShowFallAlert(false);
    setGraceTimeRemaining(0);
    setSmsStatus('cancelled');
    audioAlarm.stopAlarm();
    if (fallDetection.resetFallDetection) {
      fallDetection.resetFallDetection();
    }
  };

  const handleToggleMonitoring = async () => {
    if (!isMonitoring) {
      if (!motionSensor.hasPermission) {
        setShowPermissionModal(true);
        return;
      }
      
      motionSensor.startMonitoring();
      setIsMonitoring(true);
    } else {
      motionSensor.stopMonitoring();
      setIsMonitoring(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await motionSensor.requestPermission();
    if (granted) {
      setShowPermissionModal(false);
      motionSensor.startMonitoring();
      setIsMonitoring(true);
    }
  };

  const handleStopAlarm = () => {
    console.log('Stopping alarm and canceling alert');
    audioAlarm.stopAlarm();
    setShowFallAlert(false);
    setGraceTimeRemaining(0);
    setSmsStatus('cancelled');
    if (fallDetection.resetFallDetection) {
      fallDetection.resetFallDetection();
    }
  };

  const handleResetMonitoring = () => {
    audioAlarm.stopAlarm();
    setShowFallAlert(false);
    if (fallDetection.resetFallDetection) {
      fallDetection.resetFallDetection();
    }
    setIsMonitoring(false);
    motionSensor.stopMonitoring();
  };

  const handleTestFallDetection = () => {
    console.log('Testing fall detection...');
    setShowFallAlert(true);
    setGraceTimeRemaining(60);
    setSmsStatus('idle');
    audioAlarm.startAlarm();
  };

  const getStatusColor = () => {
    if (showFallAlert) return 'border-alert-red';
    if (isMonitoring) return 'border-safe-green';
    return 'border-gray-300';
  };

  const getStatusIcon = () => {
    if (showFallAlert) return <AlertTriangle className="h-16 w-16 text-red-500" />;
    if (isMonitoring) return <ShieldCheck className="h-16 w-16 text-green-500" />;
    return <Shield className="h-16 w-16 text-gray-400" />;
  };

  const getStatusText = () => {
    if (showFallAlert) return 'Fall Detected!';
    if (isMonitoring) return 'Monitoring Active';
    return 'Monitoring Off';
  };

  const getStatusTextColor = () => {
    if (showFallAlert) return 'text-red-500';
    if (isMonitoring) return 'text-green-500';
    return 'text-gray-500';
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md min-h-screen bg-light-grey">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Smartphone className="h-8 w-8 text-blue-500 mr-3" />
          <h1 className="text-2xl font-bold text-black">Fall Detection</h1>
        </div>
        <p className="text-gray-600 text-sm">Protect your device with smart fall detection</p>
      </header>

      {/* Status Indicator */}
      <div className="text-center mb-8">
        <div className={`w-48 h-48 mx-auto mb-6 rounded-full border-8 ${getStatusColor()} bg-white shadow-lg flex items-center justify-center relative transition-all duration-300 ${
          isMonitoring && !showFallAlert ? 'pulse-animation' : ''
        } ${showFallAlert ? 'shake-animation' : ''}`}>
          <div className="text-center">
            {getStatusIcon()}
            <p className={`text-lg font-semibold ${getStatusTextColor()} mt-2`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        {/* Motion Activity Indicator */}
        <div className="flex justify-center items-center space-x-2 mb-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                isMonitoring && motionSensor.motionData ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <p className="text-sm text-gray-500">
          {isMonitoring ? 'Monitoring device motion...' : 'No motion detected'}
        </p>
        
        {/* Motion Data Display */}
        {isMonitoring && motionSensor.motionData && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Current Motion Data:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>X: {motionSensor.motionData.x.toFixed(2)}</div>
              <div>Y: {motionSensor.motionData.y.toFixed(2)}</div>
              <div>Z: {motionSensor.motionData.z.toFixed(2)}</div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Magnitude: {Math.sqrt(
                motionSensor.motionData.x * motionSensor.motionData.x +
                motionSensor.motionData.y * motionSensor.motionData.y +
                motionSensor.motionData.z * motionSensor.motionData.z
              ).toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-blue-600">
              Threshold: {settings.customThreshold}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-8">
        {/* Main Control Button */}
        <Button
          onClick={handleToggleMonitoring}
          className={`w-full py-6 text-xl font-bold transition-all duration-300 active:scale-95 ${
            isMonitoring 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          disabled={!motionSensor.isSupported}
        >
          {isMonitoring ? (
            <>
              <Pause className="h-6 w-6 mr-3" />
              Pause Monitoring
            </>
          ) : (
            <>
              <Play className="h-6 w-6 mr-3" />
              Start Monitoring
            </>
          )}
        </Button>

        {/* Settings Button */}
        <Button
          onClick={() => setShowSettingsModal(true)}
          variant="outline"
          className="w-full py-4 text-blue-500 border-gray-200 hover:bg-gray-50"
        >
          <Settings className="h-5 w-5 mr-2" />
          Settings
        </Button>

        {/* Test Button */}
        <Button
          onClick={handleTestFallDetection}
          variant="outline"
          className="w-full py-3 text-orange-500 border-orange-200 hover:bg-orange-50"
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          Test Fall Detection
        </Button>
      </div>

      {/* Info Panel */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-black mb-4">How It Works</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-gray-700 text-sm">Device monitors motion sensors in real-time</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-gray-700 text-sm">Detects sudden impact patterns indicating a fall</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-gray-700 text-sm">Triggers loud alarm to help locate your device</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      >
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">Motion Access Required</h3>
          <p className="text-gray-600 text-sm mb-6">
            This app needs access to your device's motion sensors to detect falls.
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleRequestPermission}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Allow Motion Access
            </Button>
            <Button
              onClick={() => setShowPermissionModal(false)}
              variant="outline"
              className="w-full py-3"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Fall Alert Modal */}
      <Modal
        isOpen={showFallAlert}
        onClose={() => {}}
        className="bg-red-50"
      >
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-3">Fall Detected!</h2>
          <p className="text-gray-600 mb-4">
            Your device has detected a fall. Alarm is now playing.
          </p>
          
          {/* Grace Period Countdown */}
          {graceTimeRemaining > 0 && (
            <div className="mb-6 p-4 bg-orange-100 rounded-lg">
              <div className="text-lg font-bold text-orange-800">
                Emergency SMS in: {graceTimeRemaining}s
              </div>
              <div className="text-sm text-orange-600 mt-1">
                {settings.enableSMS && settings.emergencyContactName 
                  ? `Will notify ${settings.emergencyContactName}`
                  : 'SMS disabled or contact not set'}
              </div>
            </div>
          )}

          {/* SMS Status */}
          {smsStatus !== 'idle' && (
            <div className="mb-6 p-4 rounded-lg">
              {smsStatus === 'sending' && (
                <div className="text-blue-600">
                  <div className="text-lg font-bold">Sending Emergency SMS...</div>
                </div>
              )}
              {smsStatus === 'sent' && (
                <div className="text-green-600">
                  <div className="text-lg font-bold">✓ Emergency SMS Sent</div>
                  <div className="text-sm">Notified {settings.emergencyContactName}</div>
                </div>
              )}
              {smsStatus === 'failed' && (
                <div className="text-red-600">
                  <div className="text-lg font-bold">✗ SMS Failed</div>
                  <div className="text-sm">Unable to send emergency alert</div>
                </div>
              )}
              {smsStatus === 'cancelled' && (
                <div className="text-gray-600">
                  <div className="text-lg font-bold">Alert Cancelled</div>
                  <div className="text-sm">Emergency SMS was not sent</div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={cancelEmergencyAlert}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-lg"
            >
              <Pause className="h-5 w-5 mr-2" />
              I'm OK - Cancel Alert
            </Button>
            <Button
              onClick={audioAlarm.testAlarm}
              variant="outline"
              className="w-full py-3"
            >
              Test Alarm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        className="max-w-md"
      >
        <div className="flex flex-col h-full max-h-[80vh] sm:max-h-[85vh]">
          <div className="flex justify-between items-center mb-4 px-4 sm:px-6 pt-4 sm:pt-6 flex-shrink-0">
            <h3 className="text-lg font-semibold text-black">Settings</h3>
            <Button
              onClick={() => setShowSettingsModal(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-2 sm:pb-4">
            <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <label className="text-gray-700 font-medium text-sm sm:text-base">Sensitivity</label>
              <Select
                value={settings.sensitivity}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setSettings({ ...settings, sensitivity: value })
                }
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-gray-700 font-medium text-sm sm:text-base">Alarm Volume</label>
                <span className="text-sm text-gray-500">{settings.volume}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                onValueChange={(value) => setSettings({ ...settings, volume: value[0] })}
                max={100}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-medium text-sm sm:text-base">Vibration</label>
              <Checkbox
                checked={settings.vibration}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, vibration: checked as boolean })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-gray-700 font-medium text-sm sm:text-base">Custom Threshold</label>
                <span className="text-sm text-gray-500">{settings.customThreshold}</span>
              </div>
              <Slider
                value={[settings.customThreshold]}
                onValueChange={(value) => setSettings({ ...settings, customThreshold: value[0] })}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10 (Very Sensitive)</span>
                <span>100 (Less Sensitive)</span>
              </div>
            </div>

              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Emergency SMS</h4>
                
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 font-medium text-sm sm:text-base">Enable SMS Alerts</label>
                  <Checkbox
                    checked={settings.enableSMS}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enableSMS: checked as boolean })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium text-sm sm:text-base">Emergency Contact Name</label>
                  <Input
                    type="text"
                    placeholder="Enter contact name"
                    value={settings.emergencyContactName}
                    onChange={(e) => setSettings({ ...settings, emergencyContactName: e.target.value })}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium text-sm sm:text-base">Emergency Contact Phone</label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={settings.emergencyContactPhone}
                    onChange={(e) => setSettings({ ...settings, emergencyContactPhone: e.target.value })}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="text-xs sm:text-sm text-gray-500">
                  SMS will be sent after 60 seconds if fall is not cancelled
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 px-4 sm:px-6 pb-4 sm:pb-6 flex-shrink-0">
            <Button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-xs mt-8">
        <p>Keep your device safe with intelligent fall detection</p>
      </footer>
    </div>
  );
}
