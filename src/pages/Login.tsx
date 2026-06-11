import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export function Login() {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(username, password);
      toast.success(t('login.success'));
      navigate('/');
    } catch {
      toast.error(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language === 'tr' ? 'EN' : 'TR'}
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">{t('login.title')}</CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            {t('login.desc')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('login.username')}
              </label>
              <Input 
                type="text" 
                placeholder="admin_user" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('login.password')}
              </label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('login.button')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
