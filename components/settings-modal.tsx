import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import React from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icons } from "./icons";

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function SettingsModal({ isVisible, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const fadeAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, fadeAnimation]);

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut();
            onClose();
          },
        },
      ]
    );
  };

  const displayName = user?.user_metadata?.firstName && user?.user_metadata?.lastName
    ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
    : user?.email || "User";

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnimation }]}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            opacity: fadeAnimation,
            transform: [
              {
                translateY: fadeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [screenHeight, 0],
                }),
              },
            ],
          },
        ]}
      >
        <SafeAreaView style={styles.modal}>
          <View className="w-full h-full bg-white flex flex-col items-center py-2 px-4 rounded-t-xl">
            <Text className="text-lg font-bold">Settings</Text>
            
            <View className="w-full border-b border-gray-200 h-10 flex flex-row items-center">
              <View style={styles.settingIcon}>
                <Icons.mail size={20} />
              </View>
              <Text>{user?.email}</Text>
            </View>

            <View className="w-full border-b border-gray-200 h-10 flex flex-row items-center">
              <View style={styles.settingIcon}>
                <Icons.subscription size={20} />
              </View>
              <Text>Standard</Text>
            </View>

            <TouchableOpacity className="w-full border-b border-gray-200 h-10 flex flex-row items-center" onPress={handleSignOut}>
              <View style={styles.settingIcon}>
                <Icons.signOut color="black" size={20} />
              </View>
              <Text>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.4,
  },
  modal: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    flex: 1,
    backgroundColor: "lightgray",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Inter_700Bold",
  },
  closeButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter_700Bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    fontFamily: "Inter_600SemiBold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Inter_400Regular",
  },
  settingsList: {
    paddingTop: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIcon: {
    width: 24,
    alignItems: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Inter_400Regular",
  },
  settingArrow: {
    width: 20,
    alignItems: "center",
  },
  arrowText: {
    fontSize: 18,
    color: "#666",
    fontFamily: "Manrope_500Medium",
  }
});
