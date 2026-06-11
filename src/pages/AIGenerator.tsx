import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function AIGenerator() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Project Suggestion Hub</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Yaratıcı Proje Üretim Merkezi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            AI Idea Generator Interface goes here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
