import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useSettings } from '../contexts/SettingsContext';
import { Monitor, Moon, Sun, Languages } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export function Settings() {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('settings.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-orange-500 dark:hidden" />
              <Moon className="h-5 w-5 text-blue-400 hidden dark:block" />
              {t('settings.appearance.title')}
            </CardTitle>
            <CardDescription>
              {t('settings.appearance.desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 space-y-2"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-6 w-6" />
                <span>{t('settings.appearance.light')}</span>
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 space-y-2"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-6 w-6" />
                <span>{t('settings.appearance.dark')}</span>
              </Button>
              <Button 
                variant={theme === 'system' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 space-y-2"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-6 w-6" />
                <span>{t('settings.appearance.system')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-green-500" />
              {t('settings.language.title')}
            </CardTitle>
            <CardDescription>
              {t('settings.language.desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={language === 'tr' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 space-y-2"
                onClick={() => setLanguage('tr')}
              >
                <span className="text-2xl">🇹🇷</span>
                <span>Türkçe</span>
              </Button>
              <Button 
                variant={language === 'en' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 space-y-2"
                onClick={() => setLanguage('en')}
              >
                <span className="text-2xl">🇬🇧</span>
                <span>English</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
