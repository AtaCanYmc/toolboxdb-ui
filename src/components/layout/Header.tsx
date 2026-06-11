import { useNavigate } from 'react-router-dom';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();
  const { isDark, setTheme } = useSettings();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex-1 md:hidden">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          ToolboxDB
        </h1>
      </div>
      <div className="hidden md:block flex-1" />
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <div 
          onClick={() => navigate('/profile')}
          className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium cursor-pointer hover:bg-primary/30 transition-colors"
          title={t('nav.profile')}
        >
          <User className="h-4 w-4" />
        </div>
        <Button variant="ghost" size="icon" onClick={logout} title="Logout">
          <LogOut className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </header>
  );
}
