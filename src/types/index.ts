export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  created_at: string;
}

export interface InvoiceExtractedItem {
  id: string;
  raw_name: string;
  clean_name: string;
  quantity: number;
  category: string;
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
