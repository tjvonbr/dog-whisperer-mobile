import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIMessage } from 'ai';

export interface ChatSession {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const CHAT_SESSIONS_KEY = 'chat_sessions';

export const chatStorage = {
  async getChatSessions(): Promise<ChatSession[]> {
    try {
      const sessions = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  },

  async saveChatSession(session: ChatSession): Promise<void> {
    try {
      const sessions = await this.getChatSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.unshift(session); // Add new sessions to the beginning
      }
      
      // Sort by updatedAt descending
      sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  },

  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getChatSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  },

  generateSessionTitle(messages: UIMessage[]): string {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const text = firstUserMessage.parts.find(p => p.type === 'text')?.text || '';
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    return 'New Chat';
  }
};
