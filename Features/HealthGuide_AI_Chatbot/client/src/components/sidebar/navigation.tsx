import { MessageSquare, Stethoscope, BookOpen, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function Navigation() {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    { path: "/", label: "Health Chat", icon: MessageSquare },
    { path: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
    { path: "/health-library", label: "Health Library", icon: BookOpen },
    { path: "/find-doctor", label: "Find Doctor", icon: UserPlus }
  ];

  return (
    <nav className="space-y-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive 
                ? "bg-medical-blue hover:bg-medical-blue/90" 
                : "text-gray-600 hover:text-professional-dark hover:bg-trust-blue"
            }`}
            onClick={() => setLocation(item.path)}
          >
            <Icon className="mr-3 w-4 h-4" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
