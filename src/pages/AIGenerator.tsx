import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { generateProjectIdeas } from '../lib/api';
import type { AIProjectSuggestion } from '../types';

export function AIGenerator() {
  const { t } = useTranslation();
  const [focusArea, setFocusArea] = useState('');
  const [extraComponents, setExtraComponents] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [extraMessage, setExtraMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AIProjectSuggestion | null>(() => {
    const saved = sessionStorage.getItem('ai_suggestion');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        focus_area: focusArea,
        extra_components: extraComponents.split(',') || undefined,
        difficulty_level: difficulty || undefined,
        extra_message: extraMessage || undefined,
      };
      const res = await generateProjectIdeas(payload);
      let data = res;
      if (res.ideas && Array.isArray(res.ideas) && res.ideas.length > 0) {
        data = res.ideas[0];
      } else if (Array.isArray(res)) {
        data = res[0];
      }
      setSuggestion(data);
      sessionStorage.setItem('ai_suggestion', JSON.stringify(data));
    } catch (err) {
      console.error(err);
      toast.error(t('ai.generateFail'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('ai.title')}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel */}
        <div className="col-span-1 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('ai.cardTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('ai.focusArea')}</label>
                <Input 
                  placeholder={t('ai.focusPlaceholder')}
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Extra Components</label>
                <Input 
                  placeholder="e.g. Arduino, Relay module..."
                  value={extraComponents}
                  onChange={(e) => setExtraComponents(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Extra Message</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Any extra context or message to AI..."
                  value={extraMessage}
                  onChange={(e) => setExtraMessage(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={loading || !focusArea.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {loading ? t('ai.generating') : t('ai.generateBtn')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Results Panel */}
        <div className="col-span-1 lg:col-span-8">
          {suggestion ? (
             <Card className="border-primary/50 shadow-md shadow-primary/10">
               <CardHeader className="border-b border-border bg-muted/20">
                 <div className="flex items-start justify-between">
                   <div>
                     <CardTitle className="text-2xl text-primary">{suggestion.title || t('ai.defaultTitle')}</CardTitle>
                     <p className="text-sm text-muted-foreground mt-2">{suggestion.description}</p>
                   </div>
                   <div className="flex flex-col items-end space-y-1">
                     <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
                       {suggestion.difficulty || t('ai.defaultDiff')}
                     </span>
                     <span className="text-xs text-muted-foreground font-mono">
                       {suggestion.estimated_build_time_hours ? `${suggestion.estimated_build_time_hours} hours` : t('ai.defaultTime')}
                     </span>
                   </div>
                 </div>
               </CardHeader>
               <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                   <h3 className="text-lg font-semibold mb-4">{t('ai.requiredPieces')}</h3>
                   <ul className="space-y-3">
                     {suggestion.components_breakdown?.map((piece, idx) => (
                       <li key={idx} className="flex items-start space-x-3">
                         {piece.status === 'Available' || piece.status === 'Mevcut' ? (
                           <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                         ) : (
                           <Circle className="h-5 w-5 text-orange-500 shrink-0" />
                         )}
                         <div className="flex-1 flex justify-between items-center border-b border-border/50 pb-1">
                           <span className="text-sm font-medium">{piece.name}</span>
                           <span className={`text-xs ${piece.status === 'Available' || piece.status === 'Mevcut' ? 'text-green-500' : 'text-orange-500'}`}>
                             {piece.status}
                           </span>
                         </div>
                       </li>
                     ))}
                   </ul>
                 </div>
                 
                 <div>
                   <h3 className="text-lg font-semibold mb-4">{t('ai.steps')}</h3>
                   <ol className="space-y-4">
                     {suggestion.step_by_step_summary?.map((step, idx) => (
                       <li key={idx} className="flex space-x-3">
                         <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                           {idx + 1}
                         </span>
                         <span className="text-sm text-muted-foreground leading-relaxed">
                           {step}
                         </span>
                       </li>
                     ))}
                   </ol>
                 </div>
               </CardContent>
             </Card>
          ) : (
             <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground border-2 border-dashed border-border rounded-xl">
               <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-4" />
               <p>{t('ai.empty')}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
