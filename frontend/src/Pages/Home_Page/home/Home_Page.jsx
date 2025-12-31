import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../auth/AuthProvider";
import { NAV_ITEMS } from "./home.config.jsx";

import HomeNavbar from "./HomeNavbar";
import HomeMobileNavbar from "./HomeMobileNavbar";
import HomeSidebar from "./HomeSideBar";
import HomeContent from "./HomeContent";

const HomePage = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setAccessToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const username = user?.full_name || "User";

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <HomeNavbar
        navItems={NAV_ITEMS}
        activeItem={activeItem}
        onSelect={setActiveItem}
        profileMenuTitle={username}
        onLogout={handleLogout}
      />
      <HomeMobileNavbar
        onMenuOpen={() => setSidebarOpen(true)}
        profileMenuTitle={username}
        onLogout={handleLogout}
      />
      <HomeSidebar
        show={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={NAV_ITEMS}
        activeItem={activeItem}
        onSelect={setActiveItem}
        onLogout={handleLogout}
      />
      <HomeContent activeItem={activeItem} />
    </>
  );
};

export default HomePage;
