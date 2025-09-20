import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIMessage } from 'ai';
import { supabase } from './supabase';

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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, return empty array
        return [];
      }

      // Try Supabase first
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id || '')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        // Fallback to AsyncStorage
        return this.getChatSessionsFromStorage();
      }

      // Convert Supabase data to our format
      return data.map(row => ({
        id: row.id,
        title: row.title,
        messages: row.messages,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      // Fallback to AsyncStorage
      return this.getChatSessionsFromStorage();
    }
  },

  async getChatSessionsFromStorage(): Promise<ChatSession[]> {
    try {
      const sessions = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error getting chat sessions from storage:', error);
      return [];
    }
  },

  async saveChatSession(session: ChatSession): Promise<void> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, save to local storage only
        await this.saveChatSessionToStorage(session);
        return;
      }

      // Try Supabase first
      const { error } = await supabase
        .from('chat_sessions')
        .upsert({
          id: session.id,
          title: session.title,
          messages: session.messages,
          user_id: user.id || '',
          updated_at: new Date(session.updatedAt).toISOString(),
        });

      if (error) {
        console.error('Supabase error:', error);
        // Fallback to AsyncStorage
        await this.saveChatSessionToStorage(session);
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
      // Fallback to AsyncStorage
      await this.saveChatSessionToStorage(session);
    }
  },

  async saveChatSessionToStorage(session: ChatSession): Promise<void> {
    try {
      const sessions = await this.getChatSessionsFromStorage();
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
      console.error('Error saving chat session to storage:', error);
    }
  },

  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, delete from local storage only
        await this.deleteChatSessionFromStorage(sessionId);
        return;
      }

      // Try Supabase first
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id || ''); // Ensure user can only delete their own chats

      if (error) {
        console.error('Supabase error:', error);
        // Fallback to AsyncStorage
        await this.deleteChatSessionFromStorage(sessionId);
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
      // Fallback to AsyncStorage
      await this.deleteChatSessionFromStorage(sessionId);
    }
  },

  async deleteChatSessionFromStorage(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getChatSessionsFromStorage();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting chat session from storage:', error);
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
