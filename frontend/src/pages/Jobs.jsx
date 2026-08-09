import { useState, useEffect } from "react";
import {
    apiGetApplications,
    apiDeleteApplication,
    apiUpdateApplication,
    apiCreateApplication
} from "../api/applications";
import ApplicationForm from "../components/applicationForm.jsx";
import ApplicationCard from "../components/ApplicationCard.jsx";

import "./Jobs.css";

function Jobs() {
    const [showForm, setShowForm] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);

    // Fetch applications from backend on component mount
    useEffect(() => {
        async function loadApplications() {
            try {
                const data = await apiGetApplications();
                setApplications(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching applications:", error);
                setError("Unable to connect to the application server. Please try again in a moment.");
            }
        }

        loadApplications();
    }, []);

    // Delete application
    async function deleteApplication(id) {
        try {
            await apiDeleteApplication(id);

            setApplications(prev =>
                prev.filter(app => app.id !== id)
            );

            setError(null);
        } catch (error) {
            console.error("Failed to delete application:", error);
            setError("Unable to delete application.");
        }
    }

    // Create or update application
    async function saveApplication(application) {
        try {
            let savedApplication;

            if (editingApplication) {
                savedApplication = await apiUpdateApplication(
                    editingApplication.id,
                    application
                );

                setApplications(prev =>
                    prev.map(app =>
                        app.id === savedApplication.id
                            ? savedApplication
                            : app
                    )
                );
            } else {
                savedApplication = await apiCreateApplication(application);

                setApplications(prev => [
                    ...prev,
                    savedApplication
                ]);
            }

            setError(null);
            closeForm();
        } catch (error) {
            console.error("Failed to save application:", error);
            setError("Unable to save application.");
        }
    }

    function editApplication(application) {
        setEditingApplication(application);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingApplication(null);
    }

    return (
        <>
            <h1>Applications</h1>

            <button onClick={() => setShowForm(true)}>
                Add Application
            </button>

            {showForm && (
                <ApplicationForm
                    onClose={closeForm}
                    onSubmit={saveApplication}
                    editingApplication={editingApplication}
                />
            )}

            {error ? (
                <div className="ErrorState">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="EmptyState">
                    <h2>No applications yet.</h2>
                    <p>
                        Click the button below to add your first
                        application.
                    </p>
                    <button onClick={() => setShowForm(true)}>
                        Add Application
                    </button>
                </div>
            ) : (
                <div className="ApplicationList">
                    {applications.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onDelete={() => deleteApplication(app.id)}
                            onEdit={() => editApplication(app)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default Jobs;