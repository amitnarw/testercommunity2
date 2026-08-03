import {
  Activity, Award, BadgeCheck, Banknote, BarChart, Bell, Bookmark, Bug,
  Calendar, Camera, CheckCircle, Clock, Cloud, Code, Coins, CreditCard,
  Crown, Cpu, DollarSign, Flag, Gamepad2, Gift, GitBranch, Globe,
  Headphones, Heart, Hourglass, Keyboard, Laptop, LineChart, Mail,
  Megaphone, MessageSquare, Monitor, Mouse, PieChart, Rocket, Send,
  Server, Settings, Shield, ShieldCheck, Smartphone, Smile, Sparkles,
  Star, Tablet, Tag, Target, Terminal, ThumbsUp, Timer, TrendingDown,
  TrendingUp, Trophy, UserCheck, UserPlus, Users, Wallet, Wifi, Wrench, Zap,
  type LucideIcon,
} from "lucide-react";

export type IconCategory = "General" | "Tech" | "Devices" | "Charts & Stats" | "People & Community" | "Time & Status" | "Money & Commerce" | "Communication";

export interface CatalogEntry {
  name: string;
  component: LucideIcon;
}

export const ICON_CATALOG: Record<IconCategory, CatalogEntry[]> = {
  "General": [
    { name: "Award", component: Award },
    { name: "BadgeCheck", component: BadgeCheck },
    { name: "Sparkles", component: Sparkles },
    { name: "Star", component: Star },
    { name: "Trophy", component: Trophy },
    { name: "Crown", component: Crown },
    { name: "Flag", component: Flag },
    { name: "Bookmark", component: Bookmark },
    { name: "Tag", component: Tag },
  ],
  "Tech": [
    { name: "Globe", component: Globe },
    { name: "Rocket", component: Rocket },
    { name: "Cpu", component: Cpu },
    { name: "Wifi", component: Wifi },
    { name: "Cloud", component: Cloud },
    { name: "Server", component: Server },
    { name: "Code", component: Code },
    { name: "Terminal", component: Terminal },
    { name: "GitBranch", component: GitBranch },
    { name: "Bug", component: Bug },
    { name: "Wrench", component: Wrench },
    { name: "Settings", component: Settings },
  ],
  "Devices": [
    { name: "Smartphone", component: Smartphone },
    { name: "Tablet", component: Tablet },
    { name: "Monitor", component: Monitor },
    { name: "Laptop", component: Laptop },
    { name: "Mouse", component: Mouse },
    { name: "Keyboard", component: Keyboard },
    { name: "Headphones", component: Headphones },
    { name: "Camera", component: Camera },
    { name: "Gamepad2", component: Gamepad2 },
  ],
  "Charts & Stats": [
    { name: "BarChart", component: BarChart },
    { name: "LineChart", component: LineChart },
    { name: "PieChart", component: PieChart },
    { name: "TrendingUp", component: TrendingUp },
    { name: "TrendingDown", component: TrendingDown },
    { name: "Activity", component: Activity },
    { name: "Zap", component: Zap },
    { name: "Target", component: Target },
  ],
  "People & Community": [
    { name: "Users", component: Users },
    { name: "UserCheck", component: UserCheck },
    { name: "UserPlus", component: UserPlus },
    { name: "Heart", component: Heart },
    { name: "ThumbsUp", component: ThumbsUp },
    { name: "Smile", component: Smile },
  ],
  "Time & Status": [
    { name: "Clock", component: Clock },
    { name: "Timer", component: Timer },
    { name: "Calendar", component: Calendar },
    { name: "Hourglass", component: Hourglass },
    { name: "CheckCircle", component: CheckCircle },
    { name: "ShieldCheck", component: ShieldCheck },
    { name: "Shield", component: Shield },
  ],
  "Money & Commerce": [
    { name: "DollarSign", component: DollarSign },
    { name: "Coins", component: Coins },
    { name: "CreditCard", component: CreditCard },
    { name: "Wallet", component: Wallet },
    { name: "Gift", component: Gift },
    { name: "Banknote", component: Banknote },
  ],
  "Communication": [
    { name: "MessageSquare", component: MessageSquare },
    { name: "Mail", component: Mail },
    { name: "Bell", component: Bell },
    { name: "Megaphone", component: Megaphone },
    { name: "Send", component: Send },
  ],
};

const flatMap: Record<string, LucideIcon> = {};
for (const entries of Object.values(ICON_CATALOG)) {
  for (const entry of entries) {
    flatMap[entry.name] = entry.component;
  }
}

export const ICON_MAP: Readonly<Record<string, LucideIcon>> = flatMap;

export function resolveIcon(name?: string): LucideIcon {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return Sparkles;
}
