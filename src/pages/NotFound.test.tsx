import { render, screen } from '@testing-library/react';
import { NotFound } from './NotFound';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const keys: Record<string, string> = {
        'notfound.title': '404',
        'notfound.subtitle': 'Page Not Found',
        'notfound.desc': 'The page you are looking for doesn\'t exist or has been moved.',
        'notfound.button': 'Back to Dashboard',
      };
      return keys[key] || key;
    },
  }),
}));

describe('NotFound Page', () => {
  it('renders the 404 text and illustration', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });
});
