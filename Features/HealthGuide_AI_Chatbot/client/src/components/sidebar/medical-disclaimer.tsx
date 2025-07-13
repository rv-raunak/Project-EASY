import { AlertTriangle } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <div className="mt-6 p-4 bg-alert-red/10 border border-alert-red rounded-lg">
      <div className="flex items-start">
        <AlertTriangle className="text-alert-red w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-alert-red mb-1">Important Notice</p>
          <p className="text-xs text-professional-dark">
            This tool provides general health information only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
