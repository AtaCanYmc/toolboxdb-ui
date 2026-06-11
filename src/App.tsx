import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { InvoiceProcessing } from './pages/InvoiceProcessing';
import { InventoryList } from './pages/InventoryList';
import { AIGenerator } from './pages/AIGenerator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices" element={<InvoiceProcessing />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="ai-generator" element={<AIGenerator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
