import React, { useState } from "react";
import { AppHeader } from "@/components/header/app-header";
import { Navigation } from "@/components/sidebar/navigation";
import { MedicalDisclaimer } from "@/components/sidebar/medical-disclaimer";
import { DisclaimerFooter } from "@/components/footer/disclaimer-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Clock, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";
import { useLocation } from "wouter";

interface SymptomAssessment {
  symptoms: string[];
  duration: string;
  severity: string;
  additionalInfo: string;
  age: string;
  gender: string;
}

interface AssessmentResult {
  message: string;
  urgency: "low" | "medium" | "high";
  recommendations: string[];
  shouldSeekCare: boolean;
}

export default function SymptomChecker() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessment, setAssessment] = useState<SymptomAssessment>({
    symptoms: [],
    duration: "",
    severity: "",
    additionalInfo: "",
    age: "",
    gender: ""
  });
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const commonSymptoms = [
    "Headache", "Fever", "Cough", "Sore throat", "Fatigue", "Nausea",
    "Dizziness", "Chest pain", "Shortness of breath", "Abdominal pain",
    "Back pain", "Joint pain", "Skin rash", "Difficulty sleeping"
  ];

  const assessmentMutation = useMutation({
    mutationFn: async (assessmentData: SymptomAssessment) => {
      const sessionId = nanoid();
      
      // Create session
      await apiRequest("POST", "/api/chat/session", { sessionId });
      
      // Build assessment message
      const message = `I would like a symptom assessment. Here are my details:
      
Symptoms: ${assessmentData.symptoms.join(", ")}
Duration: ${assessmentData.duration}
Severity: ${assessmentData.severity}
Age: ${assessmentData.age}
Gender: ${assessmentData.gender}
Additional information: ${assessmentData.additionalInfo}

Please provide a health assessment with recommendations.`;

      const response = await apiRequest("POST", "/api/chat/message", {
        sessionId,
        content: message
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data.aiResponse);
      setCurrentStep(4);
    }
  });

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setAssessment(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }));
    } else {
      setAssessment(prev => ({
        ...prev,
        symptoms: prev.symptoms.filter(s => s !== symptom)
      }));
    }
  };

  const handleSubmitAssessment = () => {
    assessmentMutation.mutate(assessment);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return <AlertTriangle className="w-5 h-5" />;
      case "medium": return <Clock className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-clean-white">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Navigation />
              <MedicalDisclaimer />
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-professional-dark">Symptom Checker</CardTitle>
                <CardDescription>
                  Get personalized health guidance based on your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">What symptoms are you experiencing?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {commonSymptoms.map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom}
                            checked={assessment.symptoms.includes(symptom)}
                            onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                          />
                          <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="other-symptoms">Other symptoms not listed above:</Label>
                      <Textarea
                        id="other-symptoms"
                        placeholder="Describe any other symptoms..."
                        value={assessment.additionalInfo}
                        onChange={(e) => setAssessment(prev => ({ ...prev, additionalInfo: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <Button 
                      onClick={() => setCurrentStep(2)} 
                      disabled={assessment.symptoms.length === 0}
                      className="mt-4 bg-medical-blue hover:bg-medical-blue/90"
                    >
                      Next Step
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">How long have you had these symptoms?</h3>
                    <RadioGroup value={assessment.duration} onValueChange={(value) => setAssessment(prev => ({ ...prev, duration: value }))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="less-than-day" id="less-than-day" />
                        <Label htmlFor="less-than-day">Less than a day</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-3-days" id="1-3-days" />
                        <Label htmlFor="1-3-days">1-3 days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-week" id="1-week" />
                        <Label htmlFor="1-week">About a week</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-month" id="1-month" />
                        <Label htmlFor="1-month">About a month</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="longer" id="longer" />
                        <Label htmlFor="longer">Longer than a month</Label>
                      </div>
                    </RadioGroup>
                    
                    <h3 className="text-lg font-medium mb-4 mt-6">How severe are your symptoms?</h3>
                    <RadioGroup value={assessment.severity} onValueChange={(value) => setAssessment(prev => ({ ...prev, severity: value }))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mild" id="mild" />
                        <Label htmlFor="mild">Mild - Minor discomfort</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Moderate - Noticeable but manageable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="severe" id="severe" />
                        <Label htmlFor="severe">Severe - Significant discomfort</Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="flex space-x-4 mt-6">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(3)} 
                        disabled={!assessment.duration || !assessment.severity}
                        className="bg-medical-blue hover:bg-medical-blue/90"
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age Range</Label>
                        <Select value={assessment.age} onValueChange={(value) => setAssessment(prev => ({ ...prev, age: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-18">Under 18</SelectItem>
                            <SelectItem value="18-30">18-30</SelectItem>
                            <SelectItem value="31-50">31-50</SelectItem>
                            <SelectItem value="51-70">51-70</SelectItem>
                            <SelectItem value="over-70">Over 70</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={assessment.gender} onValueChange={(value) => setAssessment(prev => ({ ...prev, gender: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 mt-6">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmitAssessment}
                        disabled={!assessment.age || !assessment.gender || assessmentMutation.isPending}
                        className="bg-medical-blue hover:bg-medical-blue/90"
                      >
                        {assessmentMutation.isPending ? "Analyzing..." : "Get Assessment"}
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && result && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Your Health Assessment</h3>
                    
                    <div className={`p-4 rounded-lg border mb-6 ${getUrgencyColor(result.urgency)}`}>
                      <div className="flex items-center space-x-2">
                        {getUrgencyIcon(result.urgency)}
                        <span className="font-medium capitalize">{result.urgency} Priority</span>
                      </div>
                    </div>

                    <div className="bg-trust-blue rounded-lg p-4 mb-6">
                      <p className="text-professional-dark whitespace-pre-wrap">{result.message}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Recommendations:</h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-health-green mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.shouldSeekCare && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Recommendation: Seek Medical Care</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-2">
                          Based on your symptoms, it's recommended to consult with a healthcare professional for proper evaluation and treatment.
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button 
                        onClick={() => {
                          setCurrentStep(1);
                          setResult(null);
                          setAssessment({
                            symptoms: [],
                            duration: "",
                            severity: "",
                            additionalInfo: "",
                            age: "",
                            gender: ""
                          });
                        }}
                        variant="outline"
                      >
                        Start New Assessment
                      </Button>
                      <Button 
                        className="bg-health-green hover:bg-health-green/90"
                        onClick={() => setLocation("/find-doctor")}
                      >
                        Find a Doctor
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <DisclaimerFooter />
    </div>
  );
}