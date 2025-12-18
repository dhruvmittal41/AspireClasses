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
import { useLocation } from "react-router-dom";

// Import Views
import DashboardView from "./Dashboardview.jsx";
import MyTestsView from "./MyTestsView";
import TestScheduleView from "./TestScheduleView";
import ResultsView from "./ResultsView";
import AskADoubtView from "./AskdoubtView";
import ProfileView from "./Profile.jsx";
import logo from "./logo.png";

// Import Icons
import {
  DashboardIcon,
  MyTestsIcon,
  ScheduleIcon,
  ResultsIcon,
  DoubtIcon,
  LogoutIcon,
  ShopIcon,
} from "./Icons";

import "./Home_Page.css";

const navMenuItems = [
  { name: "Dashboard", icon: <DashboardIcon />, view: <DashboardView /> },
  { name: "My Tests", icon: <MyTestsIcon />, view: <MyTestsView /> },
  { name: "Get Tests", icon: <ShopIcon />, view: <TestScheduleView /> },
  { name: "Results", icon: <ResultsIcon />, view: <ResultsView /> },
  { name: "Ask a Doubt", icon: <DoubtIcon />, view: <AskADoubtView /> },
];

const HomePage = () => {
  const [username, setUserName] = useState("User");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openProfile) {
      setActiveItem("Profile");
    }
  }, [location.state]);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(userData.full_name || "User");
    }
  }, []);

  async function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    await axios.post(`${baseUrl}/api/logout`, {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
    navigate("/login");
    navigate("/");
  }

  const handleMenuClick = (name) => {
    setActiveItem(name);
    setSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch (activeItem) {
      case "Dashboard":
        return <DashboardView />;
      case "My Tests":
        return <MyTestsView />;
      case "Get Tests":
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

  const profileMenuTitle = (
    <>
      <Image
        src={`https://api.dicebear.com/8.x/initials/svg?seed=${username}`}
        roundedCircle
        width="30"
        height="30"
        className="me-2 profile-avatar"
      />
      <span className="profile-name">{username}</span>
    </>
  );
  const handleMobileMenuClick = (itemName) => {
    handleMenuClick(itemName); // Re-use your existing logic
    setSidebarOpen(false); // <-- UX IMPROVEMENT: Close the sidebar on click
  };

  return (
    <div className="home-page-layout">
      {/* === DESKTOP NAVBAR === */}
      <Navbar
        expand="lg"
        sticky="top"
        className="main-header d-none d-lg-flex glass-nav shadow-sm"
      >
        <Container fluid>
          <Navbar.Brand className="brand-logo">
            <img src={logo} alt="PrepSphere Logo" className="nav-logo-img" />
          </Navbar.Brand>
          <Nav className="me-auto nav-links">
            {navMenuItems.map((item) => (
              <Nav.Link
                key={item.name}
                active={activeItem === item.name}
                onClick={() => handleMenuClick(item.name)}
                // No need for the extra ternary operator for the 'active' class
                // The `active` prop handles this for you.
                className="d-flex align-items-center nav-item-link"
              >
                {item.icon}
                <span className="ms-2">{item.name}</span>
                {activeItem === item.name && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="active-underline"
                  />
                )}
              </Nav.Link>
            ))}
          </Nav>

          <Nav>
            <NavDropdown
              title={profileMenuTitle}
              id="profile-dropdown"
              align="end"
              className="profile-dropdown"
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

      {/* === MOBILE NAVBAR === */}
      <Navbar
        expand="lg"
        sticky="top"
        className="main-header d-lg-none glass-nav"
      >
        <Container fluid className="justify-content-between">
          <Button
            variant="outline-light"
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle navigation" // <-- IMPROVEMENT: Added for accessibility
            aria-controls="mobile-sidebar" // <-- IMPROVEMENT: Points to the sidebar
          >
            ☰
          </Button>

          {/* IMPROVEMENT: Use the image logo for brand consistency */}
          <Navbar.Brand className="brand-logo">
            <img src={logo} alt="PrepSphere Logo" className="nav-logo-img" />
          </Navbar.Brand>

          {/* Profile dropdown remains the same */}
          <Nav>
            <NavDropdown
              title={profileMenuTitle}
              id="profile-dropdown-mobile" // Use a unique id
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

      {/* === MOBILE SIDEBAR === */}
      <Offcanvas
        show={isSidebarOpen}
        onHide={() => setSidebarOpen(false)}
        className="sidebar-mobile"
        id="mobile-sidebar" // <-- IMPROVEMENT: Add ID for aria-controls
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
                // Use the new handler here
                onClick={() => handleMobileMenuClick(item.name)}
                className={`d-flex align-items-center sidebar-btn ${
                  activeItem === item.name ? "active" : ""
                }`}
              >
                {item.icon}
                <span className="ms-3">{item.name}</span>
              </Nav.Link>
            ))}
          </Nav>
          {/* This section remains the same */}
          <div className="p-2">
            <Button
              variant="danger"
              className="w-100 d-flex align-items-center justify-content-center sidebar-btn logout-btn"
              onClick={handleLogout}
            >
              <LogoutIcon />
              <span className="ms-3">Logout</span>
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* === MAIN CONTENT === */}
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
