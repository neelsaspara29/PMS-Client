import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../store/slice/auth";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user: any = useSelector((state: any) => state?.auth.user);

  const handleLogout = (e: any) => {
    e.preventDefault();
    dispatch(setLogout());
    navigate("/login");
  };
  return (
    <Navbar className="bg-body-tertiary mb-3">
      <Container>
        <Link to="/" className="text-decoration-none">
          <Navbar.Brand>PMS</Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user?.userRole == "admin" && (
            <Link to="/admin" className="me-5 text-decoration-none text-black">
              Sub-admin List
            </Link>
          )}
          <Navbar.Text>
            Signed in as: <a href="#login">{user?.userName}</a>
          </Navbar.Text>
          <Button
            variant="outline-danger"
            onClick={handleLogout}
            className="ms-1"
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
