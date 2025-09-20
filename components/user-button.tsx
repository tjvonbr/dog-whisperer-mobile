import { useAuth } from "@/lib/auth";
import { Text, TouchableOpacity } from "react-native";
import UserAvatar from "./user-avatar";

interface UserButtonProps {
  onPress?: () => void;
}

export default function UserButton({ onPress }: UserButtonProps) {
  const { user } = useAuth();

  const displayName = user?.user_metadata?.firstName && user?.user_metadata?.lastName
    ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
    : user?.email || "User";

  return (
    <TouchableOpacity 
      className="h-12 flex flex-row items-center justify-center" 
      onPress={onPress}
    >
      <UserAvatar user={user}/>
      <Text className="text-lg">{displayName}</Text>
    </TouchableOpacity>
  );
}