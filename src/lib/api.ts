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
  
  return headers;
}

export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString()
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json(); // { access_token, token_type }
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/category/?skip=0&limit=100`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
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

export async function generateProjectIdeas(payload: { focus_area: string }) {
  const response = await fetch(`${BASE_URL}/suggestions/project-ideas`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error('Failed to generate project ideas');
  return response.json();
}
