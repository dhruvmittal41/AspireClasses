// src/components/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import "./Sidebar.css"; // We'll link to a new, smaller CSS file

// Pass handleClose from the parent AdminDashboard to close the offcanvas on mobile after navigation
const Sidebar = ({ handleClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    if (handleClose) handleClose(); // Close mobile sidebar if function is provided
    navigate("/admin/login");
  };

  // Combine handleClose with navigation for mobile
  const handleNavClick = () => {
    if (handleClose) handleClose();
  };

  return (
    // Use flexbox utilities for layout and padding
    <div className="d-flex flex-column h-100 p-3">
      <h2 className="h4 text-center mb-4 text-white">Admin Menu</h2>

      {/* flex-grow-1 pushes the logout button to the bottom */}
      <Nav className="flex-column nav-pills flex-grow-1">
        <Nav.Link as={NavLink} to="/admin/assign-test" onClick={handleNavClick}>
          Assign Test
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/admin/update-questions"
          onClick={handleNavClick}
        >
          Update Questions
        </Nav.Link>

        <Nav.Link as={NavLink} to="/admin/tests" onClick={handleNavClick}>
          Manage Tests
        </Nav.Link>

        <Nav.Link as={NavLink} to="/admin/new" onClick={handleNavClick}>
          Create New Test
        </Nav.Link>
      </Nav>

      {/* mt-auto pushes this to the bottom of the flex container */}
      <div className="d-grid mt-auto">
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
