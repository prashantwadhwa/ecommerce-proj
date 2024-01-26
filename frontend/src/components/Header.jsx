import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../store/slices/usersApiSlice";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import SearchBox from "./SearchBox";

const Header = () => {
  // useLogoutMutation is for logging out the user from the server
  // logout is for logging out the user from the client

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  const isLoginPage = location.pathname === "/login";

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Ecom Shopping</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            <SearchBox/>
              <LinkContainer to="/cart">
                <Nav.Link
                  className={`text-white ${isCartPage ? "cart-active" : ""}`}
                >
                  <FaShoppingCart style={{ marginRight: "5px" }} />
                  Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <>
                  <NavDropdown
                    title={userInfo.name}
                    id="username"
                    className="text-white"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link
                      className={`text-white ${
                        isLoginPage ? "login-active" : ""
                      }`}
                    >
                      <FaUser /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title="Admin"
                  id="adminmenu"
                  className="text-white"
                >
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>

                  {/* <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer> */}

                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
