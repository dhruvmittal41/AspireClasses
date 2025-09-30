// src/components/AdminDashboard.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Navbar, Button, Offcanvas } from "react-bootstrap";
import Sidebar from "./Sidebar"; // Your existing Sidebar component
import "./AdminDashboard.css"; // We'll link to a new, smaller CSS file

const AdminDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  return (
    <div className="admin-dashboard-layout">
      {/* 1. Desktop Sidebar (hidden on small screens) */}
      <div className="admin-sidebar d-none d-lg-flex">
        <Sidebar />
      </div>

      {/* 3. Main Content Area */}
      <main className="admin-content">
        {/* The content from your routed components will be displayed here */}
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
