// CreateModal.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateModal = ({ show, onClose }) => {
  const [activeTab, setActiveTab] = useState("Event");
  const tabList = ["Event", "Task", "Appointment schedule"];

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content bg-dark text-light">
          <div className="modal-header">
            <input
              className="form-control bg-dark text-light border-0 fs-4"
              placeholder="Add title"
            />
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="d-flex mb-3">
              {tabList.map((tab) => (
                <button
                  key={tab}
                  className={`btn me-2 ${
                    activeTab === tab ? "btn-primary" : "btn-outline-light"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Appointment schedule" && (
                    <span className="badge bg-info text-dark ms-1">New</span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === "Event" && (
              <div>
                <div className="mb-3 d-flex align-items-center">
                  <i className="bi bi-clock me-2"></i>
                  <span>Thursday, May 22 &nbsp; 10:00am – 11:00am</span>
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <i className="bi bi-people me-2"></i>
                  <span>Add guests</span>
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <img
                    src="https://www.gstatic.com/meet/ic_product_logo_dark_2020q4_48dp.png"
                    alt="Meet"
                    style={{ width: 20, height: 20 }}
                    className="me-2"
                  />
                  <span>Add Google Meet video conferencing</span>
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2"></i>
                  <span>Add location</span>
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <i className="bi bi-card-text me-2"></i>
                  <span>Add description or a Google Drive attachment</span>
                </div>
              </div>
            )}

            {activeTab === "Task" && <div className="text-muted">Task form coming soon...</div>}
            {activeTab === "Appointment schedule" && <div className="text-muted">Appointment scheduler coming soon...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
