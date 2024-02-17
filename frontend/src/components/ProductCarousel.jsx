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
          <Link to={`product/65ab7f6ba00ee82db443e546`}>
            <Image src="https://www.dropbox.com/scl/fi/4bhdrepjq3rbyoj9bqcrb/Frame-8.png?rlkey=bzvczgbcs3h3wx5wcg27w06np&dl=0"/>
            {/* <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (Rs {product.price})
              </h2>
            </Carousel.Caption> */}
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
