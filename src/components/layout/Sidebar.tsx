
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
  HelpCircle
} from 'lucide-react';

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
  const currentPath = location.pathname;
  
  // Determine if sidebar is collapsed
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const isMainExpanded = menuItems.some(item => isActive(item.path));
  const isSupportExpanded = supportItems.some(item => isActive(item.path));

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive 
        ? 'bg-skillsync-primary text-white font-medium' 
        : 'hover:bg-muted/80 text-gray-700'
    }`;
  };

  return (
    <UISidebar 
      className={`border-r border-border bg-white ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      collapsible="icon"
    >
      <div className="h-16 border-b flex items-center justify-center">
        {!collapsed && (
          <div className="flex items-center gap-2 px-4">
            <div className="h-6 w-6 bg-gradient-to-br from-skillsync-primary to-skillsync-tertiary rounded-md" />
            <span className="text-lg font-bold text-skillsync-dark">
              SkillSync
            </span>
          </div>
        )}
        {collapsed && (
          <div className="h-6 w-6 bg-gradient-to-br from-skillsync-primary to-skillsync-tertiary rounded-md" />
        )}
      </div>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} className={getNavClass}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} className={getNavClass}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pt-4">
          <SidebarTrigger className="w-full flex justify-center" />
        </div>
      </SidebarContent>
    </UISidebar>
  );
};

export default Sidebar;
