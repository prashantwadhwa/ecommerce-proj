import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Col, ListGroup, Row, Image, Card } from "react-bootstrap";

import { useCreateOrderMutation } from "../store/slices/ordersApiSlice";
import { clearCartItems } from "../store/slices/cartSlice";

import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import Message from "../components/Message";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress) {
      navigate("/shipping");
    } else {
      if (!cart.paymentMethod) {
        navigate("/payment");
      }
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  // create place order handler

  const placeOrderHandler = async () => {
    try {

      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
      
    } catch (err) {
      console.log(err.message);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="order-box">
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item className="my-3">
                <h2>
                  <b>Shipping</b>
                </h2>
                <p>
                  <strong>Address: </strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                  {cart.shippingAddress.pincode},{cart.shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item className="my-3">
                <h2>
                  <b>Payment Method</b>
                </h2>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </ListGroup.Item>

              <ListGroup.Item className="my-3">
                <h2>
                  {" "}
                  <b>Order Items</b>
                </h2>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link
                              to={`/product/${item._id}`}
                              className="text-decoration-none"
                            >
                              <p>{item.name}</p>
                            </Link>
                          </Col>

                          <Col md={4} className="text-secondary">
                            {item.qty} x Rs {item.price} = Rs{" "}
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card className="py-4 my-4 ">
              <ListGroup variant="flush">
                <ListGroup.Item className="py-3">
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item className="py-3">
                  <Row>
                    <Col>Items:</Col>
                    <Col>Rs {cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item className="py-3">
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>Rs {cart.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item className="py-3">
                  <Row>
                    <Col>Tax:</Col>
                    <Col>Rs {cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item className="py-3">
                  <Row>
                    <Col>Total:</Col>
                    <Col>Rs {cart.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item className="py-3 text-center">
                  <Button
                    type="button"
                    className="btn-block "
                    disabled={cart.cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>

                  {isLoading && <Loader />}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PlaceOrder;
