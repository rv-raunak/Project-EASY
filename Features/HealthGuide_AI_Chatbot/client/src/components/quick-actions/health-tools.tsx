import { Stethoscope, BookOpen, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function HealthTools() {
  const [, setLocation] = useLocation();

  const tools = [
    {
      title: "Symptom Checker",
      description: "Get personalized health assessments",
      details: "Answer a few questions about your symptoms to get guidance on next steps.",
      icon: Stethoscope,
      iconColor: "text-medical-blue",
      bgColor: "bg-medical-blue/10",
      buttonColor: "bg-medical-blue hover:bg-medical-blue/90",
      path: "/symptom-checker"
    },
    {
      title: "Health Library",
      description: "Browse trusted medical information",
      details: "Access comprehensive information about conditions, treatments, and wellness.",
      icon: BookOpen,
      iconColor: "text-health-green",
      bgColor: "bg-health-green/10",
      buttonColor: "bg-health-green hover:bg-health-green/90",
      path: "/health-library"
    },
    {
      title: "Find a Doctor",
      description: "Connect with healthcare professionals",
      details: "Locate specialists and general practitioners in your area.",
      icon: UserPlus,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      buttonColor: "bg-purple-600 hover:bg-purple-600/90",
      path: "/find-doctor"
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <div 
            key={tool.path}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`${tool.iconColor} w-6 h-6`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-professional-dark">{tool.title}</h3>
                <p className="text-sm text-gray-500">{tool.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                {tool.details}
              </p>
              <Button 
                className={`w-full ${tool.buttonColor}`}
                onClick={() => setLocation(tool.path)}
              >
                {tool.title === "Symptom Checker" ? "Start Assessment" : 
                 tool.title === "Health Library" ? "Browse Library" : "Find Doctor"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
