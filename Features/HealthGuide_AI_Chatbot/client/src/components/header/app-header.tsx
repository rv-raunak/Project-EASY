import { Stethoscope, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Stethoscope className="text-white w-4 h-4" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-professional-dark">MedBot</h1>
              <p className="text-sm text-gray-500">Your Health Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <History className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
