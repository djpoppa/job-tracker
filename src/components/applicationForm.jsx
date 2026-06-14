import { useState } from "react";

import './applicationForm.css'

function ApplicationForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
  company: "",
  position: "",
  status: "Applied"
  });

  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);

    const newApplication = {
      id: crypto.randomUUID(),
      ...formData
    };

    console.log(newApplication);
    
    onSubmit(newApplication);

    setFormData({
    company: "",
    position: "",
    status: "Applied"
    });

    onClose();
  }

  function handleChange(e) {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  }
    
  return (
    <div 
        className="modal-overlay"
        onClick={onClose}
    >
      <div 
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add Application</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <button type="submit">
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;