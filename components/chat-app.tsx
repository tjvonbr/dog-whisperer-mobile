import ChatHistoryMenu from '@/components/chat-menu';
import { useAuth } from '@/lib/auth';
import { ChatSession, chatStorage } from '@/lib/chat-storage';
import { useChat } from '@ai-sdk/react';
import Feather from '@expo/vector-icons/Feather';
import { DefaultChatTransport, UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import { Icons } from './icons';

export default function ChatApp() {
  const [input, setInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  const { user } = useAuth();

  // Load chat sessions on component mount
  useEffect(() => {
    loadChatSessions();
  }, []);

  const { messages, error, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
    }),
    onError: error => {
      console.error('Chat error:', error);
    },
    onFinish: async (completion) => {
      try {
        if (currentSession && completion.message) {
          await chatStorage.saveMessageToSession(currentSession.id, completion.message);
          
          const updatedSession = {
            ...currentSession,
            messages: [...currentSession.messages, completion.message],
            updatedAt: new Date(),
          };
          setCurrentSession(updatedSession);
          loadChatSessions();
        }
      } catch (error) {
        console.error('Error saving assistant message:', error);
      }
    },
  });

  const loadChatSessions = async () => {
    try {
      const sessions = await chatStorage.getChatSessions();
      console.log('Loaded chat sessions:', sessions);
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const startNewChat = async () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentSession(newSession);
    setMessages([]);
    setInput('');
    setIsMenuOpen(false);
    // Load sessions to update the menu
    await loadChatSessions();
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
    setMessages(session.messages);
    setIsMenuOpen(false);
  };

  const deleteSession = async (sessionId: string) => {
    await chatStorage.deleteChatSession(sessionId);
    loadChatSessions();
    
    if (currentSession?.id === sessionId) {
      startNewChat();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || status === 'submitted' || status === 'streaming') return;

    const userMessage: UIMessage = {
      id: uuidv4(),
      role: 'user',
      parts: [{ type: 'text', text: input }],
    };

    try {
      if (!currentSession) {
        console.log('Creating new session with message:', userMessage);
        const newSession = await chatStorage.createNewSession(userMessage);
        console.log('Created new session:', newSession);
        setCurrentSession(newSession);
        await loadChatSessions();
      } else {
        // Save the user message to the existing session
        await chatStorage.saveMessageToSession(currentSession.id, userMessage);
        
        // Update the current session
        const updatedSession = {
          ...currentSession,
          messages: [...currentSession.messages, userMessage],
          updatedAt: new Date(),
        };
        setCurrentSession(updatedSession);
      }

      // Send the message to the AI
      sendMessage({ text: input });
      setInput('');
    } catch (error) {
      console.error('Error handling send message:', error);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong: {error.message}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setMessages([]);
              loadChatSessions();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuOpen(true)}
        >
          <Icons.menu size={20} />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.messagesContainer}>
        {messages.map(m => (
          <View key={m.id} style={styles.messageContainer}>
            <View style={[
              styles.messageBubble,
              m.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}>
              <Text style={[
                styles.messageText,
                m.role === 'user' ? styles.userMessageText : styles.assistantMessageText
              ]}>
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return part.text;
                    default:
                      return '';
                  }
                }).join('')}
              </Text>
            </View>
          </View>
        ))}
        
        {/* Loading indicator */}
        {(status === 'submitted' || status === 'streaming') && (
          <View style={styles.messageContainer}>
            <View style={[styles.messageBubble, styles.assistantMessage]}>
              <Text style={[styles.messageText, styles.assistantMessageText]}>
                {user?.user_metadata.dogName || 'Your dog'} is thinking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.textInputWrapper}>
          <TextInput
            multiline
            style={styles.textInput}
            placeholder={`What does ${user?.user_metadata.dogName} need help with?`}
            value={input}
            onChange={e => setInput(e.nativeEvent.text)}
            onSubmitEditing={handleSendMessage}
            autoFocus={true}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || status === 'submitted' || status === 'streaming') && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!input.trim() || status === 'submitted' || status === 'streaming'}
          >
            <Feather name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

        <ChatHistoryMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          chatSessions={chatSessions}
          onSelectSession={selectSession}
          onNewChat={startNewChat}
          onDeleteSession={deleteSession}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Manrope_500Medium',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  signOutButton: {
    padding: 8,
  },
  signOutButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    fontFamily: 'Manrope_500Medium',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginVertical: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  userMessageText: {
    color: 'white',
  },
  assistantMessageText: {
    color: '#333',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingRight: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: 'Inter_400Regular',
  },
  sendButton: {
    height: 32,
    width: 32,
    backgroundColor: 'black',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_400Regular',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
