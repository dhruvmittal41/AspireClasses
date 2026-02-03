// src/components/AdminDashboard.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {

  return (
    <div className="admin-dashboard-layout">
      <div className="admin-sidebar d-none d-lg-flex">
        <Sidebar />
      </div>

      <main className="admin-content">
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
