import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";

const HomeMobileNavbar = ({ onMenuOpen, profileMenuTitle, onLogout }) => (
  <Navbar expand="lg" sticky="top" className="main-header d-lg-none glass-nav">
    <Container fluid className="justify-content-between">
      <Button onClick={onMenuOpen}>☰</Button>
      <Navbar.Brand>PrepSphere</Navbar.Brand>
      <Nav>
        <NavDropdown title={profileMenuTitle} align="end">
          <NavDropdown.Item>My Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={onLogout} className="text-danger">
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Container>
  </Navbar>
);

export default HomeMobileNavbar;
