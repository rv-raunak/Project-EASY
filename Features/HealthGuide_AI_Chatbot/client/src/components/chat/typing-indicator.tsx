import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-health-green rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="text-white w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="bg-trust-blue rounded-lg p-4 max-w-md">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-health-green rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-health-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-health-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Typing...</p>
      </div>
    </div>
  );
}
