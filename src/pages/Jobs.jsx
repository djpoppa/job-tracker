import { useState } from "react";
import ApplicationForm from "../components/applicationForm.jsx";

function Jobs() {
  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState([]);

  function addApplication(newApplication) {
    setApplications([
      ...applications,
      newApplication
    ]);
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
    </>
    );
}

export default Jobs;