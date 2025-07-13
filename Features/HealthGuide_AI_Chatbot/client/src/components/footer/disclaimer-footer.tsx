import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DisclaimerFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-alert-red/10 border border-alert-red rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="text-alert-red w-6 h-6 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-professional-dark mb-2">
                Important Medical Disclaimer
              </h3>
              <p className="text-sm text-professional-dark mb-3">
                This health assistant provides general information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
              </p>
              <p className="text-sm text-professional-dark mb-3">
                Never disregard professional medical advice or delay in seeking it because of something you have read on this platform. If you think you may have a medical emergency, call your doctor or emergency services immediately.
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <Button variant="link" className="text-sm text-medical-blue hover:underline p-0">
                  Privacy Policy
                </Button>
                <Button variant="link" className="text-sm text-medical-blue hover:underline p-0">
                  Terms of Service
                </Button>
                <Button variant="link" className="text-sm text-medical-blue hover:underline p-0">
                  Medical Disclaimer
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">© 2024 MedBot. All rights reserved. | Version 1.0</p>
        </div>
      </div>
    </footer>
  );
}
