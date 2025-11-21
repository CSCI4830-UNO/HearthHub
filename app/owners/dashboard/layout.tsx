import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  MessageSquare, 
  DollarSign,
  Settings,
  Home as HomeIcon,
} from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { name: "Dashboard", href: "/owners/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/owners/dashboard/properties", icon: Building2 },
  { name: "Tenants", href: "/owners/dashboard/tenants", icon: Users },
  { name: "Applications", href: "/owners/dashboard/applications", icon: FileText },
  { name: "Payments", href: "/owners/dashboard/payments", icon: DollarSign },
  { name: "Messages", href: "/owners/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/owners/dashboard/settings", icon: Settings },
];

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  
  if (!data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-card border-r">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <HomeIcon className="h-6 w-6 text-primary" />
              Hearth Hub
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex items-center w-full">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Property Owner
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center md:hidden">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <HomeIcon className="h-6 w-6 text-primary" />
                Hearth Hub
              </Link>
            </div>
            <div className="flex items-center gap-4 justify-end flex-1">
              <AuthButton />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

