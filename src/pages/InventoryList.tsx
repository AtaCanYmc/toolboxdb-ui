import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function InventoryList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory & Component Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stok Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            Inventory Data Grid goes here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
