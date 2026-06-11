import React, { useEffect, useState } from 'react';
import { Moon, Sun, Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex-1 md:hidden">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          ToolboxDB
        </h1>
      </div>
      <div className="hidden md:block flex-1" />
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
