import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/header/app-header";
import { Navigation } from "@/components/sidebar/navigation";
import { MedicalDisclaimer } from "@/components/sidebar/medical-disclaimer";
import { ChatInterface } from "@/components/chat/chat-interface";
import { HealthTools } from "@/components/quick-actions/health-tools";
import { DisclaimerFooter } from "@/components/footer/disclaimer-footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = nanoid();
    setSessionId(id);
  }, []);

  // Initialize chat session
  const { data: session } = useQuery({
    queryKey: ["/api/chat/session"],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await apiRequest("POST", "/api/chat/session", { sessionId });
      return response.json();
    },
    enabled: !!sessionId,
  });

  // Get messages for session
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/messages", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const response = await fetch(`/api/chat/messages/${sessionId}`);
      return response.json();
    },
    enabled: !!sessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/chat/message", {
        sessionId,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages", sessionId] });
    },
  });

  // Clear session mutation
  const clearSessionMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/chat/session/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages", sessionId] });
    },
  });

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
            <ChatInterface
              messages={messages}
              isLoading={messagesLoading}
              onSendMessage={sendMessageMutation.mutate}
              isSending={sendMessageMutation.isPending}
              onClearSession={clearSessionMutation.mutate}
            />
          </div>
        </div>
        
        <HealthTools />
      </div>
      
      <DisclaimerFooter />
    </div>
  );
}
