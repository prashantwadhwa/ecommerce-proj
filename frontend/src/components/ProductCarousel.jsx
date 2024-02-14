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
            <Image src="https://private-user-images.githubusercontent.com/77116676/304632662-be8a7702-a784-4bd8-a67b-30e39e9cb14e.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDc4ODk0NzUsIm5iZiI6MTcwNzg4OTE3NSwicGF0aCI6Ii83NzExNjY3Ni8zMDQ2MzI2NjItYmU4YTc3MDItYTc4NC00YmQ4LWE2N2ItMzBlMzllOWNiMTRlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMTQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjE0VDA1MzkzNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPThjNzBiMGQzZDJlN2Q2MzBhZmYyYTAyZDE0NTZjZWE1ZWIxZmMwNTBjYzcwMzY4OTJlNzY3ZjQ5N2Q2ODc2MDQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.Yg1czJOsG-iE4AGrZWO3qsdlUk_kvq-buYZFu700fcg"/>
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
