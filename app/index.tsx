import ChatHistoryMenu from '@/components/ChatHistoryMenu';
import { ChatSession, chatStorage } from '@/lib/chatStorage';
import { generateAPIUrl } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import Feather from '@expo/vector-icons/Feather';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import './globals.css';

export default function App() {
  const [input, setInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  const { messages, error, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
    onFinish: async () => {
      // Save the session when a message is finished
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages: messages,
          updatedAt: new Date(),
        };
        await chatStorage.saveChatSession(updatedSession);
        setCurrentSession(updatedSession);
        loadChatSessions();
      }
    },
  });

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    try {
      const sessions = await chatStorage.getChatSessions();
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentSession(newSession);
    setMessages([]);
    setIsMenuOpen(false);
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
    setMessages(session.messages);
    setIsMenuOpen(false);
  };

  const deleteSession = async (sessionId: string) => {
    await chatStorage.deleteChatSession(sessionId);
    loadChatSessions();
    
    // If we're deleting the current session, start a new chat
    if (currentSession?.id === sessionId) {
      startNewChat();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Create a new session if none exists
    if (!currentSession) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentSession(newSession);
    }

    // Update session title if this is the first user message
    if (currentSession && currentSession.messages.length === 0) {
      const tempSession = {
        ...currentSession,
        title: chatStorage.generateSessionTitle([{ 
          id: Date.now().toString(),
          role: 'user', 
          parts: [{ type: 'text', text: input }] 
        }]),
      };
      setCurrentSession(tempSession);
    }

    sendMessage({ text: input });
    setInput('');
  };

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuOpen(true)}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentSession?.title || 'Dog Whisperer'}
        </Text>
        <View style={styles.headerSpacer} />
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
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.textInputWrapper}>
          <TextInput
            multiline
            style={styles.textInput}
            placeholder="What do you need help with?"
            value={input}
            onChange={e => setInput(e.nativeEvent.text)}
            onSubmitEditing={handleSendMessage}
            autoFocus={true}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!input.trim()}
          >
            <Feather name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat History Menu */}
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
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 36, // Same width as menu button to center the title
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
  },
  sendButton: {
    height: 32,
    width: 32,
    backgroundColor: 'black',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});