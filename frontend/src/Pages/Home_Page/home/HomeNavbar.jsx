import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { motion } from "framer-motion";

const HomeNavbar = ({
  navItems,
  activeItem,
  onSelect,
  profileMenuTitle,
  onLogout,
}) => (
  <Navbar
    expand="lg"
    sticky="top"
    className="main-header d-none d-lg-flex glass-nav shadow-sm"
  >
    <Container fluid>
      <Navbar.Brand>PrepSphere</Navbar.Brand>
      <Nav className="me-auto">
        {navItems.map((item) => (
          <Nav.Link
            key={item.name}
            active={activeItem === item.name}
            onClick={() => onSelect(item.name)}
          >
            {item.icon} <span className="ms-2">{item.name}</span>
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
        <NavDropdown title={profileMenuTitle} align="end">
          <NavDropdown.Item onClick={() => onSelect("Profile")}>
            My Profile
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={onLogout} className="text-danger">
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Container>
  </Navbar>
);

export default HomeNavbar;
