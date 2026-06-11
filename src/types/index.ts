export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  raw_name: string;
  clean_name: string | null;
  quantity: number;
  category_name: string | null;
  is_processed: boolean;
  created_at: string;
}

export interface Invoice {
  id: string;
  store_name: string;
  invoice_date: string | null;
  total_amount: number | null;
  file_path: string | null;
  created_at: string;
  items: InvoiceItem[];
}

export interface AIProjectPiece {
  name: string;
  status: 'Mevcut' | 'Satın Alınmalı';
}

export interface AIProjectSuggestion {
  id: string;
  title: string;
  description: string;
  build_time: string;
  difficulty: 'Beginner' | 'Medium' | 'Advanced';
  steps: string[];
  required_pieces: AIProjectPiece[];
}

export interface DashboardMetrics {
  total_unique_components: number;
  active_categories: number;
  unprocessed_invoices: number;
}
