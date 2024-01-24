import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash, FaArrowDown } from "react-icons/fa";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../store/slices/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the cart from the state
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // if the user is logged in then go to shipping page directly otherwise go to login page
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "2.5rem" }}>
          <strong>Shopping Cart</strong>
        </h1>
        {cartItems.length === 0 ? (
          <Message>
            Your Shopping Cart is empty. <Link to="/">Continue Shopping</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>

                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>

                  <Col md={2} style={{ fontWeight: "bold" }}>
                    Rs {item.price}/-
                  </Col>

                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                      className="form-select"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option value={x + 1} key={x + 1}>
                          Qty: {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>

                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush" className="text-center">
            <ListGroup.Item>
              <h2>
                Subtotal: {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                items
              </h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                {cartItems.map((item) => (
                  <Col key={item._id} md={6} className="p-2">
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>
                Rs{" "}
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}{" "}
                /- (inclusive of all taxes)
              </strong>
            </ListGroup.Item>

            <ListGroup.Item className="p-3">
              <Link to={"/"}>
                <Button type="button" className="btn-light mx-2">
                  Go Back
                </Button>
              </Link>

              <Button
                type="button"
                className="btn-block  mx-2"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default Cart;
