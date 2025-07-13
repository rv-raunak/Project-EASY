import React, { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Mic, Image, Bot } from "lucide-react";

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  isSending: boolean;
  onClearSession: () => void;
}

export function ChatInterface({ 
  messages, 
  isLoading, 
  onSendMessage, 
  isSending, 
  onClearSession 
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && !isSending) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-12rem)] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-health-green rounded-full flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-medium text-professional-dark">Health Assistant</h2>
            <p className="text-sm text-gray-500">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-health-green/10 text-health-green">
            <div className="w-2 h-2 bg-health-green rounded-full mr-1"></div>
            Active
          </span>
          <Button variant="outline" size="sm" onClick={onClearSession}>
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-health-green rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="bg-trust-blue rounded-lg p-4 max-w-md">
                <p className="text-sm text-professional-dark">Hello! I'm your health assistant. I can help you with:</p>
                <ul className="mt-2 text-sm text-professional-dark space-y-1">
                  <li>• General health questions</li>
                  <li>• Symptom assessment</li>
                  <li>• Health information</li>
                  <li>• When to seek medical care</li>
                </ul>
                <p className="mt-3 text-xs text-gray-600">How can I help you today?</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Just now</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isSending && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Type your health question here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                disabled={isSending}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-medical-blue"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            className="bg-medical-blue hover:bg-medical-blue/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-medical-blue">
              <Mic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-medical-blue">
              <Image className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">Press Enter to send</p>
        </div>
      </div>
    </div>
  );
}
