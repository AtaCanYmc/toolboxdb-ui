import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Package, Lightbulb, Settings, Tags } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();
  
  const navItems = [
    { name: t('nav.dashboard'), to: '/', icon: LayoutDashboard },
    { name: t('nav.invoices'), to: '/invoices', icon: FileText },
    { name: t('nav.inventory'), to: '/inventory', icon: Package },
    { name: t('nav.categories'), to: '/categories', icon: Tags },
    { name: t('nav.ai_ideas'), to: '/ai-generator', icon: Lightbulb },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          ToolboxDB
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm font-medium',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <NavLink 
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center space-x-3 px-3 py-2 w-full rounded-md transition-colors text-sm font-medium',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )
          }
        >
          <Settings className="h-5 w-5" />
          <span>{t('nav.settings')}</span>
        </NavLink>
      </div>
    </aside>
  );
}
