// src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import "./Sidebar.css";
import api from "../../api/axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const { setAccessToken, setUser } = useContext(AuthContext);

const Sidebar = ({ handleClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(`/api/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Admin logout failed:", err);
    } finally {
      setAccessToken(null);
      setUser(null);

      if (handleClose) handleClose();

      navigate("/admin/login", { replace: true });
    }
  };

  const handleNavClick = () => {
    if (handleClose) handleClose();
  };

  return (
    <div className="d-flex flex-column h-100 p-3">
      <h2 className="h4 text-center mb-4 text-white">Admin Menu</h2>

      <Nav className="flex-column nav-pills flex-grow-1" as="nav">
        <Nav.Link
          as={NavLink}
          to="/admin/assign-test"
          className="sidebar-link-custom"
          onClick={handleNavClick}
        >
          Assign Test
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin/update-questions"
          className="sidebar-link-custom"
          onClick={handleNavClick}
        >
          Update Questions
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin/create-test"
          className="sidebar-link-custom"
          onClick={handleNavClick}
        >
          Create New Test
        </Nav.Link>
      </Nav>

      <div className="d-grid mt-auto">
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
