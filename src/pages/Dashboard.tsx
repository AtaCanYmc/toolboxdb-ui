import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Package, Tags, FileClock, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { fetchComponents, fetchCategories } from '../lib/api';
import type { ComponentItem } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [comps, cats] = await Promise.all([
          fetchComponents(),
          fetchCategories()
        ]);
        setComponents(comps);
        setCategoryCount(cats.length || 0);
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalComponents = components.length;
  // This is a dummy count for unprocessed invoices for UI sake
  const unprocessedInvoices = 3; 

  const recentActivity = components.slice(0, 5).map(c => ({
    id: c.id,
    name: c.name,
    qty: c.quantity,
    status: c.quantity < 5 ? 'Low Stock' : 'In Stock'
  }));

  const metrics = [
    { title: 'Total Unique Components', value: loading ? '...' : totalComponents.toString(), icon: Package, color: 'text-blue-500' },
    { title: 'Active Categories', value: loading ? '...' : categoryCount.toString(), icon: Tags, color: 'text-purple-500' },
    { title: 'Unprocessed Invoices', value: unprocessedInvoices.toString(), icon: FileClock, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <Button 
          onClick={() => navigate('/ai-generator')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Quick AI Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity & Low Stock Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
          ) : recentActivity.length === 0 ? (
             <div className="text-sm text-muted-foreground">No recent activity</div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">{item.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">Quantity: {item.qty}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.qty < 5 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
