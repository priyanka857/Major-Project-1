import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../action/userAction";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Ecommerce Shop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/cart">
              Cart
            </Nav.Link>
            <Nav.Link as={NavLink} to="/checkout">
              Checkout
            </Nav.Link>

            {/* Admin-only menu */}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin" id="adminmenu">
                <NavDropdown.Item as={NavLink} to="/admin/productlist">
                  Manage Products
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/admin/userlist">
                  Manage Users
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/admin/orderlist">
                  Manage Orders
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav className="ms-auto">
            {userInfo ? (
              <NavDropdown
                title={`Welcome, ${userInfo.first_name || userInfo.username}`}
                id="username"
              >
                <NavDropdown.Item as={NavLink} to="/profile">
                  Profile
                </NavDropdown.Item>

                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/signup">
                  Signup
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
