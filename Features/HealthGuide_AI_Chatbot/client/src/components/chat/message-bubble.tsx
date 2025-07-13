import { Bot, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const timestamp = new Date(message.timestamp);
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  if (message.isBot) {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-health-green rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="text-white w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="bg-trust-blue rounded-lg p-4 max-w-md">
            <p className="text-sm text-professional-dark whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 justify-end">
      <div className="flex-1 max-w-md">
        <div className="bg-medical-blue rounded-lg p-4 text-right">
          <p className="text-sm text-white whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{timeAgo}</p>
      </div>
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="text-gray-600 w-4 h-4" />
      </div>
    </div>
  );
}
