import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Ghost, Home } from 'lucide-react';

export function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
      <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-primary/10">
        <Ghost className="w-16 h-16 text-primary animate-pulse" />
      </div>
      
      <div className="space-y-2 text-center">
        <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">
          {t('notfound.title')}
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">
          {t('notfound.subtitle')}
        </h2>
        <p className="max-w-[400px] text-muted-foreground">
          {t('notfound.desc')}
        </p>
      </div>

      <Button onClick={() => navigate('/')} className="mt-8 gap-2">
        <Home className="w-4 h-4" />
        {t('notfound.button')}
      </Button>
    </div>
  );
}
