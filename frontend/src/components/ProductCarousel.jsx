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
            <Image src="https://res.cloudinary.com/ds4yjzz0r/image/upload/v1708162927/Frame_8_iqtz96.png"/>
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
