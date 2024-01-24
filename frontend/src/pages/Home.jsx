import React from "react";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../store/slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";

const Home = () => {
  const { keyword } = useParams();
  const { data: products, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? (
        <>
          <h1 className="order my-3 mb-4">
            <b>Welcome To Ecom Shopping</b>
          </h1>
          <ProductCarousel />
        </>
      ) : (
        <>
          <Link to="/" className="btn btn-primary">
            Go Back
          </Link>
        </>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          {keyword ? (
            <h1 className="order my-3">
              <b>Search Results For: {keyword}</b>
            </h1>
          ) : (
            <h1 className="order my-3">
              <b>Latest Products</b>
            </h1>
          )}

          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Home;
