import { 
  chatSessions, 
  messages, 
  type ChatSession, 
  type Message, 
  type InsertChatSession, 
  type InsertMessage 
} from "@shared/schema";

export interface IStorage {
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(sessionId: string): Promise<Message[]>;
  clearSession(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private chatSessions: Map<string, ChatSession>;
  private messages: Map<string, Message[]>;
  private currentSessionId: number;
  private currentMessageId: number;

  constructor() {
    this.chatSessions = new Map();
    this.messages = new Map();
    this.currentSessionId = 1;
    this.currentMessageId = 1;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentSessionId++;
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.chatSessions.set(insertSession.sessionId, session);
    this.messages.set(insertSession.sessionId, []);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      isBot: insertMessage.isBot || false,
    };
    
    const sessionMessages = this.messages.get(insertMessage.sessionId) || [];
    sessionMessages.push(message);
    this.messages.set(insertMessage.sessionId, sessionMessages);
    
    return message;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return this.messages.get(sessionId) || [];
  }

  async clearSession(sessionId: string): Promise<void> {
    this.messages.set(sessionId, []);
  }
}

export const storage = new MemStorage();
