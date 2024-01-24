import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

import { useLoginMutation } from "../store/slices/usersApiSlice";
import { setCredentials } from "../store/slices/authSlice";

import FormContainer from "../components/FormContainer";

const Login = () => {
  // useLoginMutation server se user ko login karega
  // setCredentials client/localstorage me user ko login karega

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { search } = useLocation();

  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // now, we need to redirect the user to the home page if he is already logged in

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    // if user is already logged in, redirect him to the home page
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // dispatching login action
      const res = await login({ email, password }).unwrap();

      // save token in localstorage
      localStorage.setItem("token", JSON.stringify(res.token));

      dispatch(setCredentials({ ...res }));

      toast.success("Logged in successfully");
      navigate(redirect);
    } catch (err) {
      console.log(err.message);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <FormContainer>
        <h1 className="text-center ">Sign In</h1>

        <Form onSubmit={submitHandler}>
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

          <Row className="py-1">
            <Col>
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-decoration-none"
              >
                Register Now!
              </Link>
            </Col>
          </Row>

          <ListGroup.Item className="py-3 text-center">
            <Link to={"/"}>
              <Button type="button" className="btn-light mx-2">
                Exit
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              className="mx-2"
              disabled={isLoading}
            >
              Sign In
            </Button>

            {isLoading && <Loader />}
          </ListGroup.Item>
        </Form>
      </FormContainer>
    </>
  );
};

export default Login;
