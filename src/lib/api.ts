const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/category?skip=0&limit=100`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function fetchComponents() {
  const response = await fetch(`${BASE_URL}/components?skip=0&limit=100`);
  if (!response.ok) throw new Error('Failed to fetch components');
  return response.json();
}

export async function uploadInvoice(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${BASE_URL}/invoices/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Failed to upload invoice');
  return response.json();
}

export async function approveInvoice(invoiceId: string) {
  const response = await fetch(`${BASE_URL}/invoices/${invoiceId}/approve`, {
    method: 'POST',
  });
  
  if (!response.ok) throw new Error('Failed to approve invoice');
  return response.json();
}

export async function generateProjectIdeas(payload: { extra_components: string[], difficulty_level: string, extra_message: string }) {
  const response = await fetch(`${BASE_URL}/suggestions/project-ideas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error('Failed to generate project ideas');
  return response.json();
}
