import { useState, useEffect } from "react";

import './applicationForm.css'

function ApplicationForm({ onClose, onSubmit, editingApplication }) {
  const [formData, setFormData] = useState({
  company: "",
  position: "",
  status: "Applied"
  });

  useEffect(() => {
    if (editingApplication) {
      setFormData({
        company: editingApplication.company,
        position: editingApplication.position,
        status: editingApplication.status,
      });
    } else {
      setFormData({
        company: "",
        position: "",
        status: "Applied",
      });
    }
  }, [editingApplication]);

  function handleSubmit(e) {
    e.preventDefault();

    const newApplication = {
      id: editingApplication
        ? editingApplication.id
        : crypto.randomUUID(),
      ...formData
    };

    
    onSubmit(newApplication);

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
        <h2>
          {editingApplication ? "Edit Application" : "Add Application"}
        </h2>

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
            {editingApplication ? "Update" : "Save"}
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