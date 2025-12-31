import { Offcanvas, Nav, Button } from "react-bootstrap";
import { LogoutIcon } from "../icons/Icons";
import "./Home_Page.css";
const HomeSidebar = ({
  show,
  onClose,
  navItems,
  activeItem,
  onSelect,
  onLogout,
}) => (
  <Offcanvas show={show} onHide={onClose}>
    <Offcanvas.Body>
      <Nav className="flex-column">
        {navItems.map((item) => (
          <Nav.Link
            key={item.name}
            active={activeItem === item.name}
            onClick={() => onSelect(item.name)}
          >
            {item.icon} {item.name}
          </Nav.Link>
        ))}
      </Nav>
      <Button variant="danger" onClick={onLogout}>
        <LogoutIcon /> Logout
      </Button>
    </Offcanvas.Body>
  </Offcanvas>
);

export default HomeSidebar;
