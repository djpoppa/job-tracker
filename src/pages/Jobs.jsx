import { useState, useEffect } from "react";
import ApplicationForm from "../components/applicationForm.jsx";
import ApplicationCard from "../components/ApplicationCard.jsx";

import './Jobs.css';

function Jobs() {
  const [showForm, setShowForm] = useState(false);
  // use local storage when retrieving applications
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    return saved
      ? JSON.parse(saved)
      : [];
  });
  const [editingApplication, setEditingApplication] = useState(null);
  
  // keep local storage up to date with applications list
  useEffect(() => {
    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  // delete application by recreating list filtering out the specified id
  function deleteApplication(id) {
    setApplications(
      applications.filter(
        (app) => app.id !== id
      )
    );
  }

  // add application if new or replace application if exists
  function saveApplication(application) {
    setApplications(prev => {
        const exists = prev.some(a => a.id === application.id);

        if (exists) {
            return prev.map(a =>
                a.id === application.id ? application : a
            );
        }

        return [...prev, application];
    });
  }

  function editApplication(application) {
    setShowForm(true);
    setEditingApplication(application);

  }

  function closeForm() {
    setShowForm(false);
    setEditingApplication(null);
  }
  

  return (
    <>
      <h1>Applications</h1>
      <button
        onClick={() =>
          setShowForm(true)
        }
      >
        Add Application
      </button>
      
      {showForm && 
        <ApplicationForm 
          onClose={closeForm} 
          onSubmit={saveApplication}
          editingApplication={editingApplication}
        />
      }

      {applications.length === 0 ? (
        <div className="EmptyState">
          <h2>No applications yet.</h2>
          <p>Click the button below to add your first application.</p>
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