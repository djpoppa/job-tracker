import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Jobs from "./Jobs";

import {
  apiGetApplications,
  apiDeleteApplication,
  apiUpdateApplication,
  apiCreateApplication,
} from "../api/applications";

// Mock API functions
vi.mock("../api/applications", () => ({
  apiGetApplications: vi.fn(),
  apiDeleteApplication: vi.fn(),
  apiUpdateApplication: vi.fn(),
  apiCreateApplication: vi.fn(),
}));

// Mock child components
vi.mock("../components/applicationForm.jsx", () => ({
  default: ({ onClose, onSubmit, editingApplication }) => (
    <div data-testid="application-form">
      <button onClick={onClose}>
        Close
      </button>

      <button
        onClick={() =>
          onSubmit({
            company: "Test Company",
            position: "Test Position",
            status: "Applied",
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

vi.mock("../components/ApplicationCard.jsx", () => ({
  default: ({ application, onDelete, onEdit }) => (
    <div data-testid={`application-${application.id}`}>
      {application.company}

      <button onClick={onDelete}>
        Delete
      </button>

      <button onClick={onEdit}>
        Edit
      </button>
    </div>
  ),
}));

describe("Jobs Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    apiGetApplications.mockResolvedValue([]);
  });

  const openApplicationForm = async () => {
    const user = userEvent.setup();

    await user.click(
      screen.getAllByRole("button", {
        name: /add application/i,
      })[0]
    );

    return user;
  };

  it("renders the Jobs page", async () => {
    render(<Jobs />);

    expect(
      screen.getByText("Applications")
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", {
        name: /add application/i,
      }).length
    ).toBeGreaterThan(0);

    await waitFor(() => {
      expect(apiGetApplications).toHaveBeenCalledTimes(1);
    });
  });

  it("shows empty state when there are no applications", async () => {
    apiGetApplications.mockResolvedValue([]);

    render(<Jobs />);

    expect(
      await screen.findByText("No applications yet.")
    ).toBeInTheDocument();
  });

  it("loads applications from the API", async () => {
    apiGetApplications.mockResolvedValue([
      {
        id: 1,
        company: "Company A",
        position: "Developer",
        status: "Applied",
      },
      {
        id: 2,
        company: "Company B",
        position: "Engineer",
        status: "Interview",
      },
    ]);

    render(<Jobs />);

    expect(
      await screen.findByText("Company A")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Company B")
    ).toBeInTheDocument();

    expect(apiGetApplications).toHaveBeenCalledTimes(1);
  });

  it("opens the application form", async () => {
    render(<Jobs />);

    await openApplicationForm();

    expect(
      screen.getByTestId("application-form")
    ).toBeInTheDocument();
  });

  it("closes the application form", async () => {
    render(<Jobs />);

    const user = await openApplicationForm();

    await user.click(
      screen.getByRole("button", {
        name: "Close",
      })
    );

    expect(
      screen.queryByTestId("application-form")
    ).not.toBeInTheDocument();
  });

  it("creates a new application", async () => {
    const createdApplication = {
      id: 1,
      company: "Test Company",
      position: "Test Position",
      status: "Applied",
    };

    apiCreateApplication.mockResolvedValue(
      createdApplication
    );

    render(<Jobs />);

    const user = await openApplicationForm();

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      })
    );

    await waitFor(() => {
      expect(apiCreateApplication).toHaveBeenCalledWith({
        company: "Test Company",
        position: "Test Position",
        status: "Applied",
      });
    });

    expect(
      await screen.findByText("Test Company")
    ).toBeInTheDocument();
  });

  it("deletes an application", async () => {
    apiGetApplications.mockResolvedValue([
      {
        id: 1,
        company: "Company A",
        position: "Developer",
        status: "Applied",
      },
    ]);

    apiDeleteApplication.mockResolvedValue();

    render(<Jobs />);

    expect(
      await screen.findByText("Company A")
    ).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {
      expect(apiDeleteApplication).toHaveBeenCalledWith(1);
    });

    expect(
      screen.queryByText("Company A")
    ).not.toBeInTheDocument();
  });

  it("opens edit mode for an application", async () => {
    apiGetApplications.mockResolvedValue([
      {
        id: 1,
        company: "Company A",
        position: "Developer",
        status: "Applied",
      },
    ]);

    render(<Jobs />);

    expect(
      await screen.findByText("Company A")
    ).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    expect(
      screen.getByTestId("editing-mode")
    ).toBeInTheDocument();
  });

  it("updates an application when editing", async () => {
    const existingApplication = {
      id: 1,
      company: "Company A",
      position: "Developer",
      status: "Applied",
    };

    const updatedApplication = {
      id: 1,
      company: "Test Company",
      position: "Test Position",
      status: "Applied",
    };

    apiGetApplications.mockResolvedValue([
      existingApplication,
    ]);

    apiUpdateApplication.mockResolvedValue(
      updatedApplication
    );

    render(<Jobs />);

    expect(
      await screen.findByText("Company A")
    ).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      })
    );

    await waitFor(() => {
      expect(apiUpdateApplication).toHaveBeenCalledWith(
        1,
        {
          company: "Test Company",
          position: "Test Position",
          status: "Applied",
        }
      );
    });

    expect(
      await screen.findByText("Test Company")
    ).toBeInTheDocument();
  });

  it("shows empty state after deleting the last application", async () => {
    apiGetApplications.mockResolvedValue([
      {
        id: 1,
        company: "Company A",
        position: "Developer",
        status: "Applied",
      },
    ]);

    apiDeleteApplication.mockResolvedValue();

    render(<Jobs />);

    expect(
      await screen.findByText("Company A")
    ).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      await screen.findByText("No applications yet.")
    ).toBeInTheDocument();
  });
});