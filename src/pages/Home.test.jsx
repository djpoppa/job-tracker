import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

const renderHome = () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe('Home Component', () => {
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

  it('renders a link to the jobs page', () => {
    renderHome();

    const link = screen.getByRole('link', {
      name: /view applications/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/jobs');
  });
});