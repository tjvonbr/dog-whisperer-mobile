import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIMessage } from 'ai';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
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
      console.log('Current user in getChatSessions:', user);
      
      if (!user) {
        // If no user, return empty array
        console.log('No user found, returning empty array');
        return [];
      }

      // Try Supabase first
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id || '')
        .order('updated_at', { ascending: false });

      console.log('Supabase query result:', { data, error, userId: user.id });

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
      console.log('Current user in saveChatSession:', user);
      
      if (!user) {
        // If no user, save to local storage only
        console.log('No user found, saving to local storage');
        await this.saveChatSessionToStorage(session);
        return;
      }

      // Try Supabase first
      const sessionData = {
        id: session.id,
        title: session.title,
        messages: session.messages,
        user_id: user.id || '',
        updated_at: new Date(session.updatedAt).toISOString(),
      };
      console.log('Saving session to Supabase:', sessionData);
      
      const { error } = await supabase
        .from('chat_sessions')
        .upsert(sessionData);

      if (error) {
        console.error('Supabase error:', error);
        // Fallback to AsyncStorage
        await this.saveChatSessionToStorage(session);
      } else {
        console.log('Successfully saved session to Supabase');
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
      // Fallback to AsyncStorage
      await this.saveChatSessionToStorage(session);
    }
  },

  async saveMessageToSession(sessionId: string, message: UIMessage): Promise<void> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, save to local storage only
        await this.saveMessageToSessionInStorage(sessionId, message);
        return;
      }

      // Get current session from Supabase
      const { data: sessionData, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        await this.saveMessageToSessionInStorage(sessionId, message);
        return;
      }

      // Add the new message to the existing messages
      const updatedMessages = [...(sessionData.messages || []), message];

      // Update the session with the new message
      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating session with message:', updateError);
        await this.saveMessageToSessionInStorage(sessionId, message);
      }
    } catch (error) {
      console.error('Error saving message to session:', error);
      await this.saveMessageToSessionInStorage(sessionId, message);
    }
  },

  async saveMessageToSessionInStorage(sessionId: string, message: UIMessage): Promise<void> {
    try {
      const sessions = await this.getChatSessionsFromStorage();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex >= 0) {
        sessions[sessionIndex].messages.push(message);
        sessions[sessionIndex].updatedAt = new Date();
        await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Error saving message to session in storage:', error);
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
  },

  async createNewSession(firstMessage: UIMessage): Promise<ChatSession> {
    const sessionId = uuidv4();
    const title = this.generateSessionTitle([firstMessage]);
    
    const newSession: ChatSession = {
      id: sessionId,
      title,
      messages: [firstMessage],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.saveChatSession(newSession);
    return newSession;
  }
};
