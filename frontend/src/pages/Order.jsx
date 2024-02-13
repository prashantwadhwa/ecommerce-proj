import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../store/slices/ordersApiSlice";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Order = () => {
  const { id: orderId } = useParams();

  //   console.log("orderId:", orderId);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  //   console.log(order);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });

        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment successful");
  }

  function onError(err) {
    console.log(err);
    toast.error(err?.data?.message || err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        // console.log(orderId);
        return orderId;
      });
  }

  const markAsDeliveredHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();

      toast.success("Order marked as delivered");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" />
      ) : (
        <>
          <h1 className="order">
            <b>Order #{order._id}</b>
          </h1>

          <Row className="py-4">
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>
                    <b>Shipping</b>
                  </h2>
                  <p>
                    <strong>Name: </strong> {order.user.name}
                  </p>

                  <p>
                    <strong>Email: </strong>{" "}
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>

                  <p>
                    <strong>Address: </strong>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>

                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivered on {new Date(order.deliveredAt).toLocaleString()}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>
                    <b>Payment Method</b>
                  </h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>

                  {order.isPaid ? (
                    <Message variant="success">Paid on {new Date(order.paidAt).toLocaleString()}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item variant="flush">
                  <h2>
                    <b>Order Items</b>
                  </h2>
                  {order.orderItems.map((item, index) => (
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
                            to={`/product/${item.product}`}
                            className="text-decoration-none"
                          >
                            <p>{item.name}</p>
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x Rs {item.price} = Rs{" "}
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={4}>
              <Card className="card">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>Rs {order.itemsPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>Rs {order.shippingPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Tax</Col>
                      <Col>Rs {order.taxPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Total</Col>
                      <Col>Rs {order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Pay Order */}
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {isPending ? (
                        <Loader />
                      ) : (
                        <div className="text-center my-3">
                          {/* <Button
                            onClick={onApproveTest}
                            style={{ marginBottom: "10px" }}
                          >
                            Test Payment Button
                          </Button> */}
                          <div>
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            />
                          </div>
                        </div>
                      )}
                    </ListGroup.Item>
                  )}

                  {/* Mark as delivered */}

                  {loadingDeliver && <Loader />}

                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item className="text-center py-2 m-2">
                        <Button
                          type="button"
                          className="btn btn-block btn-blue "
                          onClick={markAsDeliveredHandler}
                        >
                          Mark as Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Order;
