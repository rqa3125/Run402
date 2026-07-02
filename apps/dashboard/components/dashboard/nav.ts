import {
  LayoutDashboard,
  FolderKanban,
  FlaskConical,
  KeyRound,
  BarChart3,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

/** Primary sidebar navigation. Single source of truth for routes + icons. */
export const primaryNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Playground", href: "/playground", icon: FlaskConical },
  { label: "API Keys", icon: KeyRound, comingSoon: true },
  { label: "Analytics", icon: BarChart3, comingSoon: true },
  { label: "Billing", icon: CreditCard, comingSoon: true },
  { label: "Settings", href: "/settings", icon: Settings },
];
