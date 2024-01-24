import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, ListGroup } from "react-bootstrap";

import { useRegisterMutation } from "../store/slices/usersApiSlice";
import { setCredentials } from "../store/slices/authSlice";

import { toast } from "react-hot-toast";

import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";

const Register = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // now, we need to redirect the user to the home page if he is already logged in
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    // if user is already logged in, redirect him to the home page
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      try {
        // dispatching register action
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));

        toast.success("Registered successfully");
        navigate(redirect);
      } catch (err) {
        console.log(err.message);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <h1 className="text-center ">Sign Up</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
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

          <Row className="py-1">
            <Col>
              Already Registered?{" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-decoration-none">
                Login Now!
              </Link>
            </Col>
          </Row>

          <ListGroup.Item className="py-3 text-center">
            <Link to={"/"}>
              <Button type="button" className="btn-light mx-2">
                Exit
              </Button>
            </Link>

            <Button type="submit" variant="primary" className="mx-2">
              Sign Up
            </Button>
            {isLoading && <Loader />}
          </ListGroup.Item>
        </Form>
      </FormContainer>
    </>
  );
};

export default Register;
