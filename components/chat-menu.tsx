import { Chat } from '@/lib/chat-storage';
import React from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from './icons';
import SettingsModal from './settings-modal';
import UserButton from './user-button';

interface ChatHistoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
  chatSessions: Chat[];
  onSelectSession: (session: Chat) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const MENU_WIDTH = screenWidth * 0.8;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export default function ChatHistoryMenu({
  isOpen,
  onClose,
  chatSessions,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatHistoryMenuProps) {
  const slideAnimation = React.useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);

  React.useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isOpen ? 0 : -MENU_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnimation]);

  const filteredSessions = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return chatSessions;
    }
    return chatSessions.filter(session =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatSessions, searchQuery]);

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      
      <AnimatedSafeAreaView
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <View style={styles.searchIconContainer}>
              <Icons.search color="#666" size={18} strokeWidth={2} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity onPress={onNewChat} style={styles.closeButton}>
            <Icons.write color="black" size={18} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sessionsList}>
          {filteredSessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <TouchableOpacity
                className='h-10 flex-1'
                onPress={() => {
                  onSelectSession(session);
                  onClose();
                }}
              >
                <Text style={styles.sessionTitle} numberOfLines={1}>
                  {session.title}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          
          {filteredSessions.length === 0 && chatSessions.length > 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No chats found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search terms
              </Text>
            </View>
          )}
          
          {chatSessions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No chat history yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start a new conversation to see it here
              </Text>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.userButtonContainer}>
          <UserButton onPress={() => setIsSettingsVisible(true)} />
        </View>
      </AnimatedSafeAreaView>

      <SettingsModal
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
      />
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
    height: screenHeight,
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
    paddingVertical: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter_400Regular',
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
  userButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
