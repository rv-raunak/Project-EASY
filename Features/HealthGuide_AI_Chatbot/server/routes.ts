import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateHealthResponse } from "./services/gemini";
import { insertChatSessionSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create or get chat session
  app.post("/api/chat/session", async (req, res) => {
    try {
      const { sessionId } = insertChatSessionSchema.parse(req.body);
      
      let session = await storage.getChatSession(sessionId);
      if (!session) {
        session = await storage.createChatSession({ sessionId });
      }
      
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Get messages for a session
  app.get("/api/chat/messages/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createMessage({
        ...messageData,
        isBot: false
      });

      // Get chat history for context
      const chatHistory = await storage.getMessages(messageData.sessionId);
      const historyForAI = chatHistory.slice(-10).map(msg => ({
        role: msg.isBot ? "assistant" as const : "user" as const,
        content: msg.content
      }));

      // Generate AI response
      const aiResponse = await generateHealthResponse(messageData.content, historyForAI);
      
      // Save bot message
      const botMessage = await storage.createMessage({
        sessionId: messageData.sessionId,
        content: aiResponse.message,
        isBot: true
      });

      res.json({
        userMessage,
        botMessage,
        aiResponse
      });
    } catch (error) {
      console.error("Chat message error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Clear chat session
  app.delete("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
