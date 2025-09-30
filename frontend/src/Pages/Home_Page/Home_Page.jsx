// src/HomePage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Image,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Import Views
import DashboardView from "./Dashboardview.jsx";
import MyTestsView from "./MyTestsView";
import TestScheduleView from "./TestScheduleView";
import ResultsView from "./ResultsView";
import AskADoubtView from "./AskdoubtView";
import ProfileView from "./Profile.jsx";

// Import Icons
import {
  DashboardIcon,
  MyTestsIcon,
  ScheduleIcon,
  ResultsIcon,
  DoubtIcon,
  LogoutIcon,
} from "./Icons";

import "./Home_Page.css";

// --- Menu Items ---
const navMenuItems = [
  { name: "Dashboard", icon: <DashboardIcon />, view: <DashboardView /> },
  { name: "My Tests", icon: <MyTestsIcon />, view: <MyTestsView /> },
  { name: "Test Schedule", icon: <ScheduleIcon />, view: <TestScheduleView /> },
  { name: "Results", icon: <ResultsIcon />, view: <ResultsView /> },
  { name: "Ask a Doubt", icon: <DoubtIcon />, view: <AskADoubtView /> },
];

const HomePage = () => {
  const [username, setUserName] = useState("User");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMenuClick = (name) => {
    setActiveItem(name);
    setSidebarOpen(false); // close offcanvas on mobile
  };

  // Render active view
  const renderActiveView = () => {
    switch (activeItem) {
      case "Dashboard":
        return <DashboardView />;
      case "My Tests":
        return <MyTestsView />;
      case "Test Schedule":
        return (
          <TestScheduleView
            onNavigateToProfile={() => handleMenuClick("Profile")}
          />
        );
      case "Results":
        return <ResultsView />;
      case "Ask a Doubt":
        return <AskADoubtView />;
      case "Profile":
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  // Profile dropdown title
  const profileMenuTitle = (
    <>
      <Image
        src={`https://api.dicebear.com/8.x/initials/svg?seed=${username}`}
        roundedCircle
        width="30"
        height="30"
        className="me-2"
      />
      {username}
    </>
  );

  return (
    <div className="home-page-layout">
      {/* === DESKTOP NAVBAR === */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="main-header d-none d-lg-flex"
      >
        <Container fluid>
          <Navbar.Brand>AspireClasses</Navbar.Brand>
          <Nav className="me-auto">
            {navMenuItems.map((item) => (
              <Nav.Link
                key={item.name}
                active={activeItem === item.name}
                onClick={() => handleMenuClick(item.name)}
                className="d-flex align-items-center"
              >
                {item.icon}
                <span className="ms-2">{item.name}</span>
              </Nav.Link>
            ))}
          </Nav>

          {/* Profile Dropdown */}
          <Nav>
            <NavDropdown
              title={profileMenuTitle}
              id="profile-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={() => handleMenuClick("Profile")}>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* === MOBILE/TABLET NAVBAR + SIDEBAR === */}
      <Navbar
        bg="dark"
        variant="dark"
        sticky="top"
        className="main-header d-lg-none"
      >
        <Container fluid>
          <Button variant="outline-light" onClick={() => setSidebarOpen(true)}>
            ☰
          </Button>
          <Navbar.Brand className="mx-auto">AspireClasses</Navbar.Brand>
          <Nav>
            <NavDropdown
              title={profileMenuTitle}
              id="profile-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={() => handleMenuClick("Profile")}>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Mobile Sidebar Offcanvas */}
      <Offcanvas
        show={isSidebarOpen}
        onHide={() => setSidebarOpen(false)}
        className="sidebar-mobile"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column p-0">
          <Nav className="flex-column flex-grow-1 p-2">
            {navMenuItems.map((item) => (
              <Nav.Link
                key={item.name}
                active={activeItem === item.name}
                onClick={() => handleMenuClick(item.name)}
                className="d-flex align-items-center sidebar-btn"
              >
                {item.icon}
                <span className="ms-3">{item.name}</span>
              </Nav.Link>
            ))}
          </Nav>
          <div className="p-2">
            <Button
              variant="danger"
              className="w-100 d-flex align-items-center justify-content-center sidebar-btn"
              onClick={handleLogout}
            >
              <LogoutIcon />
              <span className="ms-3">Logout</span>
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Page Content */}
      <main className="main-content">
        <div className="content-wrapper p-3 p-md-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
