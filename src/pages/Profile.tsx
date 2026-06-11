import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Shield, Calendar, Loader2, LogOut } from 'lucide-react';
import { fetchProfile } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from '../types';

export function Profile() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        {t('profile.loading_error')}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
        <Button variant="destructive" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t('profile.logout')}
        </Button>
      </div>

      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="pb-8 text-center pt-10">
          <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{profile.username}</CardTitle>
          <CardDescription className="text-base mt-2">
            {t('profile.system_info')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 border">
              <Mail className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium leading-none">{t('profile.email')}</p>
                <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 border">
              <Shield className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm font-medium leading-none">{t('profile.role')}</p>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 border md:col-span-2">
              <Calendar className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium leading-none">{t('profile.joined')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(profile.created_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
