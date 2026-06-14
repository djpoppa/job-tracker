import { useState, useEffect } from "react";
import ApplicationForm from "../components/applicationForm.jsx";

function Jobs() {
  const [showForm, setShowForm] = useState(false);
  // use local storage when retrieving applications
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    return saved
      ? JSON.parse(saved)
      : [];
  });
  
  // keep local storage up to date with applications list
  useEffect(() => {
    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  // add new application by recreating list with new application appended
  function addApplication(newApplication) {
    setApplications([
      ...applications,
      newApplication
    ]);
  }

  function deleteApplication(id) {
    setApplications(
      applications.filter(
        (app) => app.id !== id
      )
    );
  }
  

  return (
    <>
      <h1>Applications</h1>
      <button
        onClick={() =>
          setShowForm(!showForm)
        }
      >
        Add Application
      </button>

      {showForm && 
        <ApplicationForm 
          onClose={() => setShowForm(false)} 
          onSubmit={addApplication}
        />
      }

      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            {app.company} - {app.position} - {app.status}
            <button
              onClick={() =>
                deleteApplication(app.id)
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

    </>
    );
}

export default Jobs;