import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import twilio from "twilio";

export async function registerRoutes(app: Express): Promise<Server> {
  // Emergency SMS endpoint
  app.post('/api/send-emergency-sms', async (req, res) => {
    const { to, contactName, message } = req.body;
    
    // Validate input
    if (!to || !contactName || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      // Check if Twilio credentials are available
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      
      if (!accountSid || !authToken || !fromNumber) {
        console.log('Twilio credentials not configured, simulating SMS:', {
          to,
          contactName,
          message,
          timestamp: new Date().toISOString()
        });
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return res.json({ 
          success: true, 
          message: 'Emergency SMS simulated (no Twilio credentials)',
          timestamp: new Date().toISOString()
        });
      }
      
      // Format phone number for international compatibility
      let formattedTo = to.trim();
      if (!formattedTo.startsWith('+')) {
        // If no country code, assume US/Canada (+1)
        if (formattedTo.length === 10) {
          formattedTo = '+1' + formattedTo;
        } else if (formattedTo.length === 11 && formattedTo.startsWith('1')) {
          formattedTo = '+' + formattedTo;
        }
      }
      
      // Initialize Twilio client
      const client = twilio(accountSid, authToken);
      
      // Send actual SMS
      const smsMessage = await client.messages.create({
        body: message,
        from: fromNumber,
        to: formattedTo
      });
      
      console.log('Emergency SMS sent successfully:', {
        to: formattedTo,
        contactName,
        message,
        messageId: smsMessage.sid,
        timestamp: new Date().toISOString()
      });
      
      res.json({ 
        success: true, 
        message: 'Emergency SMS sent successfully',
        messageId: smsMessage.sid,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      res.status(500).json({ 
        error: 'Failed to send emergency SMS',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Serve service worker and manifest files
  app.get('/sw.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.resolve(import.meta.dirname, '../public/sw.js'));
  });

  app.get('/manifest.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.sendFile(path.resolve(import.meta.dirname, '../public/manifest.json'));
  });

  app.get('/icon-192.svg', (req, res) => {
    res.set('Content-Type', 'image/svg+xml');
    res.sendFile(path.resolve(import.meta.dirname, '../public/icon-192.svg'));
  });

  const httpServer = createServer(app);

  return httpServer;
}
