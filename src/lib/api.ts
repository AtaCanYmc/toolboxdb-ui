const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export function getAuthToken() {
  return localStorage.getItem('access_token');
}

function getHeaders(isFormData = false) {
  const token = getAuthToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  headers['Accept-Language'] = localStorage.getItem('i18nextLng') || 'tr';
  
  return headers;
}

export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const lang = localStorage.getItem('i18nextLng') || 'tr';
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': lang,
    },
    body: formData.toString()
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json(); // { access_token, token_type }
}

export async function fetchProfile() {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/category/?skip=0&limit=100`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function createCategory(name: string) {
  const response = await fetch(`${BASE_URL}/category/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
}

export async function updateCategory(id: number, name: string) {
  const response = await fetch(`${BASE_URL}/category/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to update category');
  return response.json();
}

export async function deleteCategory(id: number) {
  const response = await fetch(`${BASE_URL}/category/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return true;
}

export async function fetchComponents() {
  const response = await fetch(`${BASE_URL}/components/?skip=0&limit=100`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch components');
  return response.json();
}

export async function uploadInvoice(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${BASE_URL}/invoices/upload`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  
  if (!response.ok) throw new Error('Failed to upload invoice');
  return response.json();
}

export async function approveInvoice(invoiceId: string) {
  const response = await fetch(`${BASE_URL}/invoices/${invoiceId}/approve`, {
    method: 'POST',
    headers: getHeaders()
  });
  
  if (!response.ok) throw new Error('Failed to approve invoice');
  return response.json();
}

export async function generateProjectIdeas(payload: { focus_area: string; extra_components?: string[]; difficulty_level?: string; extra_message?: string; }) {
  const response = await fetch(`${BASE_URL}/suggestions/project-ideas`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error('Failed to generate project ideas');
  return response.json();
}

export async function getProjectDetails(payload: { project_title: string; project_description: string; difficulty: string; components: string[]; }) {
  const response = await fetch(`${BASE_URL}/suggestions/give-detail`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error('Failed to get project details');
  return response.json();
}

export async function fetchInvoices() {
  const response = await fetch(`${BASE_URL}/invoices/?skip=0&limit=100`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json();
}

export async function fetchInvoiceDetail(id: string) {
  const response = await fetch(`${BASE_URL}/invoices/${id}`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch invoice details');
  return response.json();
}

export async function updateInvoiceItem(itemId: string, payload: { clean_name?: string; quantity?: number; category_name?: string }) {
  const response = await fetch(`${BASE_URL}/invoices/items/${itemId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Failed to update invoice item');
  return response.json();
}

export async function deleteInvoiceItem(itemId: string) {
  const response = await fetch(`${BASE_URL}/invoices/items/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete invoice item');
  return true;
}

export async function deleteInvoice(id: string) {
  const response = await fetch(`${BASE_URL}/invoices/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete invoice');
  return true;
}
