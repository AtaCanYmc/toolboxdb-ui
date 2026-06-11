import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { InvoiceProcessing } from './pages/InvoiceProcessing';
import { InventoryList } from './pages/InventoryList';
import { AIGenerator } from './pages/AIGenerator';
import { Categories } from './pages/Categories';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<InvoiceProcessing />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="categories" element={<Categories />} />
            <Route path="ai-generator" element={<AIGenerator />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
