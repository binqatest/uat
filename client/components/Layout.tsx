import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Wallet,
  Package,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Gear,
  Key,
  Zap,
  Eye,
  Info,
  PlusCircle,
  XCircle,
  RotateCw,
  Mail,
  MessageCircle,
  Globe,
  List,
  UserPlus,
  Calculator,
  RefreshCw,
  Cog,
  Gift,
  Banknote,
  Users,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  title: string;
  icon: any;
  href?: string;
  items?: NavigationItem[];
  roles?: string[];
}

const sidebarNavItems: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Balance Management",
    icon: Wallet,
    items: [
      {
        title: "Adjust Balance",
        icon: Settings,
        href: "/adjust_balance",
        roles: ["business", "admin"],
      },
      {
        title: "PIN Recharge",
        icon: Key,
        href: "/recharge_pin",
      },
      {
        title: "PIN-less Recharge",
        icon: Zap,
        href: "/recharge_pinless",
      },
      {
        title: "Check Balance",
        icon: Eye,
        href: "/update_and_balance_info",
      },
    ],
  },
  {
    title: "Bundle Management",
    icon: Package,
    items: [
      {
        title: "Bundle Details",
        icon: Info,
        href: "/bundle_info",
      },
      {
        title: "Subscribe Bundle (Self)",
        icon: PlusCircle,
        href: "/subscribe_bundle",
      },
      {
        title: "Gift Bundle",
        icon: Gift,
        href: "/gift_bundle",
      },
      {
        title: "Take Loan",
        icon: Banknote,
        href: "/loan_bundle",
      },
      {
        title: "List Subscribed",
        icon: List,
        href: "/subscribed_bundles",
      },
      {
        title: "CVM Bundle",
        icon: Users,
        href: "/cvm_bundle",
      },
      {
        title: "Remove Bundle",
        icon: XCircle,
        href: "/remove_bundle",
      },
      {
        title: "Update Resources",
        icon: RotateCw,
        href: "/update_bundle",
      },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    roles: ["business", "admin"],
    items: [
      {
        title: "Templates",
        icon: Mail,
        href: "/master_notification_list",
      },
      {
        title: "All Notifications",
        icon: MessageCircle,
        href: "/notification_list",
      },
    ],
  },
  {
    title: "Rates",
    icon: Globe,
    roles: ["admin"],
    items: [
      {
        title: "Roaming Rate Upload",
        icon: Upload,
        href: "/roaming_rate_upload",
      },
      {
        title: "Roaming Rates",
        icon: Globe,
        href: "/roaming_rates",
      },
      {
        title: "Rate Mapping Table",
        icon: List,
        href: "/rate_mapping_table",
      },
      {
        title: "Compare Tariff",
        icon: RefreshCw,
        href: "/rate_mapping_compare",
      },
    ],
  },
  {
    title: "Users",
    icon: User,
    roles: ["admin"],
    items: [
      {
        title: "All Users",
        icon: List,
        href: "/user_management",
      },
      {
        title: "Add User",
        icon: UserPlus,
        href: "/registration",
      },
    ],
  },
  {
    title: "Utilities",
    icon: Cog,
    roles: ["admin"],
    items: [
      {
        title: "Unit Conversion",
        icon: RefreshCw,
        href: "/unit_convertion",
      },
      {
        title: "Tax Calculator",
        icon: Calculator,
        href: "/tax_cal",
      },
      {
        title: "Bundle Config",
        icon: Settings,
        href: "/bundle_list_new",
      },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Balance Management",
    "Bundle Management",
  ]);
  const location = useLocation();
  const { user, logout } = useAuth();

  const hasAccess = (roles?: string[]): boolean => {
    if (!roles || roles.length === 0) return true;
    if (!user) return false;
    return roles.some((role) => user.groups.includes(role));
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.items) {
      return item.items.some((subItem) => location.pathname === subItem.href);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 h-16">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="font-semibold text-lg">Safaricom NCC UAT</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto p-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">
                      {user?.name || "Unknown User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 top-16 z-40 w-64 transform bg-sidebar border-r transition-transform duration-200 ease-in-out md:relative md:top-0 md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedItems.includes(item.title);
                const isActive = isItemActive(item);

                // Single-level navigation item
                if (!item.items) {
                  return (
                    <Link
                      key={item.title}
                      to={item.href || "#"}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  );
                }

                // Multi-level navigation item with sub-items
                return (
                  <Collapsible
                    key={item.title}
                    open={isExpanded}
                    onOpenChange={() => toggleExpanded(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1 text-left">{item.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      {item.items?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = location.pathname === subItem.href;

                        return (
                          <Link
                            key={subItem.href}
                            to={subItem.href || "#"}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-6 py-2 text-sm transition-colors ml-6",
                              isSubActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <SubIcon className="h-4 w-4" />
                            {subItem.title}
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Safaricom NCC UAT. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-yellow-100 text-yellow-800">
                UAT ENVIRONMENT
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
