import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer, FormContainer } from "react-router-bootstrap";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { useProfileMutation } from "../store/slices/usersApiSlice";
import { setCredentials } from "../store/slices/authSlice";
import { useGetMyOrdersQuery } from "../store/slices/ordersApiSlice";

const Profile = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

//   const { userInfo } = useSelector((state) => state.auth);

//   const [updateProfile, { isLoading: loadingUpdateProfile }] =
//     useProfileMutation();

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

//   useEffect(() => {
//     setName(userInfo.name);
//     setEmail(userInfo.email);
//   }, [userInfo.name, userInfo.email]);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//     } else {
//       try {
//         const res = await updateProfile({
//           name,
//           email,
//           password,
//         }).unwrap();

//         dispatch(setCredentials({ ...res }));
//         toast.success("Profile updated successfully");
//       } catch (err) {
//         console.log(err.message);
//         toast.error(err?.data?.message || err.error);
//       }
//     }
//   };

  return (
    <div className="login-form">
      <Row>
        {/* <Col md={15}>
          <h2 className="text-center">User Profile</h2>

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-4">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password" className="my-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" variant="primary">
                Update
              </Button>
              {loadingUpdateProfile && <Loader />}
            </div>
          </Form>
        </Col> */}
        <Col md={12}>
          <h2 className="text-center py-2">
            <b>My Orders</b>
          </h2>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>Rs {order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ><FaTimes/></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ><FaTimes/></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="light">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
