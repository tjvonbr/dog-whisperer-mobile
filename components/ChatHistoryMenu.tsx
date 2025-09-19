import { ChatSession } from '@/lib/chatStorage';
import React from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ChatHistoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
  chatSessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const MENU_WIDTH = screenWidth * 0.8;

export default function ChatHistoryMenu({
  isOpen,
  onClose,
  chatSessions,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatHistoryMenuProps) {
  const slideAnimation = React.useRef(new Animated.Value(-MENU_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isOpen ? 0 : -MENU_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnimation]);

  const formatDate = (date: Date | string | any) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return 'Unknown';
      }
      
      const now = new Date();
      const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 168) { // 7 days
        return d.toLocaleDateString([], { weekday: 'short' });
      } else {
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date);
      return 'Unknown';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      
      {/* Menu */}
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat History</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.newChatButton} onPress={onNewChat}>
          <Text style={styles.newChatButtonText}>+ New Chat</Text>
        </TouchableOpacity>

        <ScrollView style={styles.sessionsList}>
          {chatSessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <TouchableOpacity
                style={styles.sessionContent}
                onPress={() => {
                  onSelectSession(session);
                  onClose();
                }}
              >
                <Text style={styles.sessionTitle} numberOfLines={2}>
                  {session.title}
                </Text>
                <Text style={styles.sessionDate}>
                  {formatDate(session.updatedAt)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteSession(session.id)}
              >
                <Text style={styles.deleteButtonText}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          {chatSessions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No chat history yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start a new conversation to see it here
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Inter_700Bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Manrope_500Medium',
  },
  newChatButton: {
    margin: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  newChatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Manrope_600SemiBold',
  },
  sessionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Inter_500Medium',
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope_500Medium',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
