import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-background">
      <Container>
        <Row>
          <Col className="text-center py-3 ">
            <p>&copy; {currentYear} Ecom Shopping</p>
            <p>Made With ❤️‍🔥 in India</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
