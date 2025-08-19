import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  Menu,
  ChevronRight,
  Calendar,
  GraduationCap,
  FileText,
  Clock,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  {
    name: "Dashboard",
    href: "/student-dashboard",
    icon: Home,
    description: "Overview and stats",
    roles: ["student"],
  },
  {
    name: "My Followings",
    href: "/student-dashboard/my-followings",
    icon: Users,
    description: "Your following list",
    roles: ["student"],
  },
  {
    name: "Learning Resources",
    href: "/student-dashboard/resources",
    icon: BookOpen,
    description: "Study materials",
    roles: ["student"],
  },
  {
    name: "Study Schedule",
    href: "/student-dashboard/study-schedule",

    icon: Calendar,
    description: "Your timetable",
    roles: ["student"],
  },
  {
    name: "Study Groups",
    href: "/student-dashboard/study-groups",
    icon: GraduationCap,
    description: "Collaborate & learn",
    roles: ["student"],
  },
  {
    name: "Notes & Assignments",
    href: "/student-dashboard/notes",
    icon: FileText,
    description: "Your academic work",
    roles: ["student"],
  },
  {
    name: "Study Progress",
    href: "/student-dashboard/progress",
    icon: Clock,
    description: "Track learning goals",
    roles: ["student"],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const role = useSelector((state) => state.auth?.role);
  const userAuth = useSelector((state) => state.auth.userAuth);

  const filteredNavigation = role
    ? navigation.filter((item) => item.roles.includes(role))
    : [];

  const isCurrentPath = (path) => location.pathname === path;

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-bg dark:bg-bg-dark">
      {/* User Profile Section */}
      <div className="p-6 border-b border-primary/20 dark:border-primary-dark/20 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-2 ring-primary/30 dark:ring-primary-dark/30 shadow-lg">
              <AvatarImage src={userAuth?.profilePicture} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-bg dark:text-bg-dark font-bold text-lg">
                {userAuth?.username?.charAt(0)?.toUpperCase() || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent dark:bg-accent-dark rounded-full border-2 border-bg dark:border-bg-dark flex items-center justify-center">
              <div className="w-2 h-2 bg-bg dark:bg-bg-dark rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-text dark:text-text-dark truncate">
              {userAuth?.username || "Student"}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border-primary/30 dark:border-primary-dark/30 text-xs font-medium">
                {userAuth?.role || "Student"}
              </Badge>
              <span className="text-xs text-text/60 dark:text-text-dark/60 font-medium">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {filteredNavigation.map((item) => {
          const isActive = isCurrentPath(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={classNames(
                "group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 ease-out relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 dark:from-primary-dark/20 dark:via-primary-dark/15 dark:to-primary-dark/10 text-primary dark:text-primary-dark border-l-4 border-primary dark:border-primary-dark shadow-lg scale-[1.02]"
                  : "text-text/70 dark:text-text-dark/70 hover:text-text dark:hover:text-text-dark hover:bg-primary/8 dark:hover:bg-primary-dark/8 hover:scale-[1.01] hover:shadow-md"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary-dark/10 opacity-50"></div>
              )}
              <item.icon
                className={classNames(
                  "mr-4 h-5 w-5 transition-all duration-300 relative z-10",
                  isActive
                    ? "text-primary dark:text-primary-dark scale-110"
                    : "text-text/50 dark:text-text-dark/50 group-hover:text-text/80 dark:group-hover:text-text-dark/80 group-hover:scale-105"
                )}
              />
              <div className="flex-1 relative z-10">
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-text/50 dark:text-text-dark/50 mt-0.5 group-hover:text-text/70 dark:group-hover:text-text-dark/70">
                  {item.description}
                </div>
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-primary dark:text-primary-dark relative z-10 animate-pulse" />
              )}
            </Link>
          );
        })}

        <Separator className="my-8 bg-gradient-to-r from-transparent via-primary/20 dark:via-primary-dark/20 to-transparent" />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-text/60 dark:text-text-dark/60 uppercase tracking-widest px-4 mb-4">
            Quick Access
          </h4>
          <Link
            to="/posts"
            className="group flex items-center px-4 py-3 text-sm text-text/70 dark:text-text-dark/70 hover:text-text dark:hover:text-text-dark hover:bg-primary/8 dark:hover:bg-primary-dark/8 rounded-xl transition-all duration-300 hover:scale-[1.01]"
          >
            <BookOpen className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Browse Posts</span>
          </Link>
          <Link
            to="/dashboard/settings"
            className="group flex items-center px-4 py-3 text-sm text-text/70 dark:text-text-dark/70 hover:text-text dark:hover:text-text-dark hover:bg-primary/8 dark:hover:bg-primary-dark/8 rounded-xl transition-all duration-300 hover:scale-[1.01]"
          >
            <Settings className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Settings</span>
          </Link>
          <Link
            to="/dashboard/notifications"
            className="group flex items-center px-4 py-3 text-sm text-text/70 dark:text-text-dark/70 hover:text-text dark:hover:text-text-dark hover:bg-primary/8 dark:hover:bg-primary-dark/8 rounded-xl transition-all duration-300 hover:scale-[1.01]"
          >
            <Bell className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Notifications</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary/20 dark:border-primary-dark/20">
        <div className="bg-gradient-to-r from-primary/15 via-accent/10 to-secondary/15 dark:from-primary-dark/15 dark:via-accent-dark/10 dark:to-secondary-dark/15 rounded-xl p-4 border border-primary/20 dark:border-primary-dark/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 dark:bg-accent-dark/20 rounded-lg">
              <GraduationCap className="h-6 w-6 text-accent dark:text-accent-dark" />
            </div>
            <div>
              <div className="text-sm font-bold text-text dark:text-text-dark">
                Edu Nexus
              </div>
              <div className="text-xs text-text/70 dark:text-text-dark/70">
                Empowering Education, One Step at a Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex h-screen bg-bg dark:bg-bg-dark">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:top-16 lg:border-r lg:border-primary/20 dark:lg:border-primary-dark/20 lg:bg-bg dark:lg:bg-bg-dark lg:shadow-xl lg:z-30 lg:backdrop-blur-sm">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden fixed top-20 left-4 z-40 bg-bg/90 dark:bg-bg-dark/90 backdrop-blur-sm border-primary/30 dark:border-primary-dark/30 text-text dark:text-text-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 shadow-lg hover:scale-110 transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 bg-bg dark:bg-bg-dark border-primary/30 dark:border-primary-dark/30 z-50"
          >
            <SidebarContent mobile />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 lg:pl-80 overflow-hidden">
          <div className="h-full overflow-y-auto pt-16 lg:pt-0">
            <div className="p-6 lg:p-8 pt-20 lg:pt-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
