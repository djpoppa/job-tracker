import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Jobs from './Jobs';

// Mock child components
vi.mock('../components/applicationForm.jsx', () => ({
  default: ({ onClose, onSubmit, editingApplication }) => (
    <div data-testid="application-form">
      <button onClick={onClose}>
        Close
      </button>

      <button
        onClick={() =>
          onSubmit({
            id: editingApplication?.id ?? 1,
            name: 'Test App',
            company: 'Test Company',
          })
        }
      >
        Submit
      </button>

      {editingApplication && (
        <span data-testid="editing-mode">
          Editing
        </span>
      )}
    </div>
  ),
}));

vi.mock('../components/ApplicationCard.jsx', () => ({
  default: ({ application, onDelete, onEdit }) => (
    <div data-testid={`application-${application.id}`}>
      <span>{application.name}</span>

      <button onClick={onDelete}>
        Delete
      </button>

      <button onClick={onEdit}>
        Edit
      </button>
    </div>
  ),
}));

describe('Jobs Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const openApplicationForm = async () => {
    const user = userEvent.setup();

    await user.click(
      screen.getAllByRole('button', {
        name: /add application/i,
      })[0]
    );

    return user;
  };

  it('renders the Jobs page', () => {
    render(<Jobs />);

    expect(
      screen.getByText('Applications')
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('button', {
        name: /add application/i,
      }).length
    ).toBeGreaterThan(0);
  });


  it('shows empty state when there are no applications', () => {
    render(<Jobs />);

    expect(
      screen.getByText('No applications yet.')
    ).toBeInTheDocument();
  });


  it('opens the application form', async () => {
    render(<Jobs />);

    await openApplicationForm();

    expect(
      screen.getByTestId('application-form')
    ).toBeInTheDocument();
  });


  it('closes the application form', async () => {
    render(<Jobs />);

    const user = await openApplicationForm();

    await user.click(
      screen.getByRole('button', {
        name: 'Close',
      })
    );

    expect(
      screen.queryByTestId('application-form')
    ).not.toBeInTheDocument();
  });


  it('adds a new application', async () => {
    render(<Jobs />);

    const user = await openApplicationForm();

    await user.click(
      screen.getByRole('button', {
        name: 'Submit',
      })
    );

    expect(
      screen.getByText('Test App')
    ).toBeInTheDocument();

    const savedApplications = JSON.parse(
      localStorage.getItem('applications')
    );

    expect(savedApplications).toHaveLength(1);
    expect(savedApplications[0].company)
      .toBe('Test Company');
  });


  it('loads applications from localStorage', () => {
    localStorage.setItem(
      'applications',
      JSON.stringify([
        {
          id: 1,
          name: 'Company A',
          company: 'A Corp',
        },
        {
          id: 2,
          name: 'Company B',
          company: 'B Corp',
        },
      ])
    );

    render(<Jobs />);

    expect(
      screen.getByText('Company A')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Company B')
    ).toBeInTheDocument();
  });


  it('deletes an application', async () => {
    localStorage.setItem(
      'applications',
      JSON.stringify([
        {
          id: 1,
          name: 'Company A',
          company: 'A Corp',
        },
      ])
    );

    render(<Jobs />);

    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', {
        name: 'Delete',
      })
    );

    expect(
      screen.queryByText('Company A')
    ).not.toBeInTheDocument();

    const savedApplications = JSON.parse(
      localStorage.getItem('applications')
    );

    expect(savedApplications).toHaveLength(0);
  });


  it('opens edit mode for an application', async () => {
    localStorage.setItem(
      'applications',
      JSON.stringify([
        {
          id: 1,
          name: 'Company A',
          company: 'A Corp',
        },
      ])
    );

    render(<Jobs />);

    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', {
        name: 'Edit',
      })
    );

    expect(
      screen.getByTestId('editing-mode')
    ).toBeInTheDocument();
  });


  it('updates an application when editing', async () => {
    localStorage.setItem(
      'applications',
      JSON.stringify([
        {
          id: 1,
          name: 'Company A',
          company: 'A Corp',
        },
      ])
    );

    render(<Jobs />);

    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', {
        name: 'Edit',
      })
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Submit',
      })
    );

    const savedApplications = JSON.parse(
      localStorage.getItem('applications')
    );

    expect(savedApplications).toHaveLength(1);
    expect(savedApplications[0].id).toBe(1);
  });


  it('shows empty state after deleting the last application', async () => {
    localStorage.setItem(
      'applications',
      JSON.stringify([
        {
          id: 1,
          name: 'Company A',
          company: 'A Corp',
        },
      ])
    );

    render(<Jobs />);

    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', {
        name: 'Delete',
      })
    );

    expect(
      screen.getByText('No applications yet.')
    ).toBeInTheDocument();
  });
});