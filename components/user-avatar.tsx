import { User } from "@supabase/supabase-js";
import { StyleSheet, Text, View } from "react-native";

interface UserAvatarProps {
  user: User | null;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  if (!user || !user.user_metadata) {
    return null;
  }
  
  const userInitials = (user.user_metadata.firstName?.charAt(0) || '') + (user.user_metadata.lastName?.charAt(0) || '');

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {userInitials.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Inter_700Bold",
  },
})