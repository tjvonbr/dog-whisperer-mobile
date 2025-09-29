import { Calendar, ChartNoAxesGantt, Eye, EyeOff, Loader2, LogOut, Mail, MessageCircle, Search, SquarePen, SquarePlus, type LucideIcon } from 'lucide-react-native'

export const Icons: Record<string, LucideIcon> = {
  calendar: Calendar,
  chat: MessageCircle,
  eye: Eye,
  eyeOff: EyeOff,
  menu: ChartNoAxesGantt,
  mail: Mail,
  search: Search,
  signOut: LogOut,
  spinner: Loader2,
  subscription: SquarePlus,
  write: SquarePen,
}