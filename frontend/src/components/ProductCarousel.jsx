import React from "react";
import Loader from "./Loader";
import Message from "./Message";

import { useGetTopProductsQuery } from "../store/slices/productsApiSlice";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark mb-3">
      {products.map(product => (
        <Carousel.Item key={product._id}>
          <Link to={`product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid style={{ width: '30em', height: '30em' }}/>
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (Rs {product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
