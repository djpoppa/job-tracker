import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

vi.mock('../auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../auth/AuthContext';

const renderHome = () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });
  });

  it('renders the page heading', () => {
    renderHome();

    expect(
      screen.getByRole('heading', {
        name: /job tracker/i,
      })
    ).toBeInTheDocument();
  });

  it('renders the description', () => {
    renderHome();

    expect(
      screen.getByText(
        /keep all of your job applications organized in one place/i
      )
    ).toBeInTheDocument();
  });

  it('displays the feature list', () => {
    renderHome();

    expect(
      screen.getByText(/track applications/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/update interview status/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/monitor offers and rejections/i)
    ).toBeInTheDocument();
  });

  it('shows a login link when the user is not logged in', () => {
    renderHome();

    const link = screen.getByRole('link', {
      name: /log in/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');

    expect(
      screen.queryByRole('link', {
        name: /view applications/i,
      })
    ).not.toBeInTheDocument();
  });

  it('shows a link to the jobs page when the user is logged in', () => {
    useAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com' },
      loading: false,
    });

    renderHome();

    const link = screen.getByRole('link', {
      name: /view applications/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/jobs');

    expect(
      screen.queryByRole('link', {
        name: /log in/i,
      })
    ).not.toBeInTheDocument();
  });

  it('shows a loading button while authentication is loading', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    renderHome();

    expect(
      screen.getByRole('button', {
        name: /loading/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: /log in/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: /view applications/i,
      })
    ).not.toBeInTheDocument();
  });
});