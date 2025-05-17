
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar as UISidebar, 
  SidebarContent, 
  SidebarTrigger, 
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';

import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  BarChart,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Profile Builder', 
    path: '/profile-builder', 
    icon: User 
  },
  { 
    name: 'Skill Assessment', 
    path: '/skill-assessment', 
    icon: FileText 
  },
  { 
    name: 'Job Market', 
    path: '/job-market', 
    icon: Briefcase 
  },
  { 
    name: 'Skill Gap', 
    path: '/skill-gap', 
    icon: BarChart 
  },
  { 
    name: 'Learning Path', 
    path: '/learning-path', 
    icon: BookOpen 
  },
];

const supportItems = [
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings 
  },
  { 
    name: 'Help', 
    path: '/help', 
    icon: HelpCircle 
  },
];

const Sidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout, user } = useAuth();
  const currentPath = location.pathname;
  
  // Determine if sidebar is collapsed
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const isMainExpanded = menuItems.some(item => isActive(item.path));
  const isSupportExpanded = supportItems.some(item => isActive(item.path));

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
      isActive 
        ? 'bg-skillsync-primary text-white font-medium shadow-sm' 
        : 'text-skillsync-dark hover:bg-skillsync-gray-light hover:text-skillsync-primary'
    }`;
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <UISidebar 
      className={`border-r border-skillsync-gray-light bg-white shadow-sm z-10 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      collapsible="icon"
    >
      <div className="h-16 border-b border-skillsync-gray-light flex items-center justify-center">
        {!collapsed && (
          <div className="flex items-center gap-2 px-4">
            <div className="h-8 w-8 bg-gradient-to-br from-skillsync-primary to-skillsync-tertiary rounded-md shadow-sm" />
            <span className="text-lg font-bold text-skillsync-dark">
              SkillSync
            </span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 bg-gradient-to-br from-skillsync-primary to-skillsync-tertiary rounded-md shadow-sm" />
        )}
      </div>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-skillsync-dark/70 font-medium px-4 ${collapsed ? 'sr-only' : ''}`}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} className={getNavClass}>
                      <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-skillsync-primary'}`} />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={`text-skillsync-dark/70 font-medium px-4 mt-4 ${collapsed ? 'sr-only' : ''}`}>
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} className={getNavClass}>
                      <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-skillsync-primary'}`} />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User information and logout */}
        <div className="mt-auto px-4 pt-4 border-t border-skillsync-gray-light">
          {!collapsed && user && (
            <div className="mb-2 px-2">
              <div className="text-sm font-medium text-skillsync-dark">
                {user.name}
              </div>
              <div className="text-xs text-skillsync-dark/70 truncate">
                {user.email}
              </div>
            </div>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-skillsync-gray-light text-skillsync-dark hover:text-destructive hover:border-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2 text-red-500" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarTrigger className="mt-2 w-full flex justify-center text-skillsync-primary hover:bg-skillsync-gray-light rounded-md" />
        </div>
      </SidebarContent>
    </UISidebar>
  );
};

export default Sidebar;
