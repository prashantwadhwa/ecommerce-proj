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
            <Image src="https://uc7ba8c8df86834e318672a1948b.previews.dropboxusercontent.com/p/thumb/ACJ9Z-UYN3WUv2sTJ5aiBQfDZTNc6B582_AYnDl28wJBmga8wkmlFffLU7cNLkt-T8bRJ-c_VaR8XixVPOxAsu4rJswOUMzzMQR0Dn4Ec7C6aUQT-w11JfKMpnY310JPPEzA_Quc300fw-BWX8b6RoRUi14avH2CiPd5IWBopSjwtPA6ljYPz2IC5etUYKMIXIrggcUjVB-yAGQ2SirgNcC9k7AfB9YGpfMOSmgpkKYD2nU_9N-v9ksIBxmlZQqkSigb7dxnEBP-v5mkvlD4EzVjrjizVDafFHE0DqH3b-CZ2Qrv7vVjejsx6Qr-jv7Xf0ZO1ZpkulK1TemQKQLtTQN1giU_bix5U-6RNWNJtY-5l_aa-3A-r_xlaMFA3RZ5f3g/p.png"/>
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
