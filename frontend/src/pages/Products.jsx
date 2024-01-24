import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  useGetProductByIdQuery,
  useCreateReviewMutation,
} from "../store/slices/productsApiSlice";
import { Link } from "react-router-dom";

import { addToCart } from "../store/slices/cartSlice";

import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import toast from "react-hot-toast";
import { FaArrowDown } from "react-icons/fa";
import Meta from "../components/Meta";

const Products = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    try {
      // dispatching addToCart action
      dispatch(addToCart({ ...product, qty }));

      toast.success("Product added to cart successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const buyNowHandler = () => {
    try {
      // dispatching addToCart action
      dispatch(addToCart({ ...product, qty }));
      navigate("/cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const reviewHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      refetch();
      toast.success("Review Submitted");
      setRating(0);
      setComment("");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <>
          <Link to="/">
            <Button className="btn btn-blue my-3">Go Back</Button>
          </Link>
          <Meta title={product.name} />
          <Row>
            <Col md={5}>
              <Image
                src={product.image}
                alt={product.name}
                fluid
                style={{ height: "350px" }}
              />
            </Col>

            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Description </strong> <br /> {product.description}
                </ListGroup.Item>
                <ListGroup.Item>Price: Rs {product.price}/-</ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>Rs {product.price}/-</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <p
                          style={{
                            color: product.countInStock > 0 ? "green" : "red",
                          }}
                        >
                          {product.countInStock > 0 ? (
                            <strong>In Stock</strong>
                          ) : (
                            <strong>Out of Stock</strong>
                          )}
                        </p>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {/* jitni items stock me hai, max utni hi qty customer select kr skta hai. */}

                            {[...Array(product.countInStock).keys()].map(
                              (p) => (
                                <option key={p + 1} value={p + 1}>
                                  {" "}
                                  {p + 1}{" "}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}

                  <ListGroup.Item className="text-center p-3">
                    <Button
                      className="btn btn-blue mx-2 "
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>

                    <Button
                      className="btn btn-success mx-2"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={buyNowHandler}
                    >
                      Buy Now
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <div className="review-box">
            <Row className="review">
              <Col md={4}>
                <h2>
                  <b>Reviews</b>
                </h2>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                <ListGroup variant="flush">
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col md={8}>
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={reviewHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Select Rating ⬇️ </option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write your review here..."
                        ></Form.Control>
                      </Form.Group>

                      <Button type="submit" className="btn btn-blue">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
};

export default Products;
