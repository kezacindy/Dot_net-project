import React from "react";
import { Carousel, Container, Row, Col } from "react-bootstrap";

// Import images - adjust paths as necessary
import perfume1 from "../assets/imagesProduct/dd(1).jpeg";
import perfume2 from "../assets/imagesProduct/dd(2).jpeg";
import perfume3 from "../assets/imagesProduct/dd.jpeg";
import perfume4 from "../assets/imagesProduct/download (2).jpeg";

import watch1 from "../assets/imagesProduct/download (10).jpeg";
import watch2 from "../assets/imagesProduct/images (12).jpeg";
import watch3 from "../assets/imagesProduct/download (7).jpeg";
import watch4 from "../assets/imagesProduct/download (8).jpeg";

import jeans1 from "../assets/imagesProduct/images (1).jpeg";
import jeans2 from "../assets/imagesProduct/images (6).jpeg";
import jeans3 from "../assets/imagesProduct/images (3).jpeg";
import jeans4 from "../assets/imagesProduct/image.jpeg";

import shirt1 from "../assets/imagesProduct/download.jpeg";
import shirt2 from "../assets/imagesProduct/ima.jpeg";
import shirt3 from "../assets/imagesProduct/images (7).jpeg";
import shirt4 from "../assets/imagesProduct/images.jpeg";

import mixed1 from "../assets/imagesProduct/download (4).jpeg";
import mixed2 from "../assets/imagesProduct/download (9).jpeg";
// Reusing shirt1 for third image in last carousel based on HTML
import mixed4 from "../assets/imagesProduct/images (2).jpeg";

// Simple CSS for hero section matching Thymeleaf (can move to CSS file)
const heroStyle = {
  padding: "60px",
  textAlign: "left", // Adjust alignment as needed
};
const heroH1Style = {
  fontSize: "3em",
  color: "#007bff", // Bootstrap primary color
  marginBottom: "20px",
};
const heroPStyle = {
  fontSize: "1.2em",
  color: "#6c757d", // Bootstrap secondary text color
  margin: "20px 0",
};

const HomePage = () => {
  return (
    <Container fluid className="p-0">
      {" "}
      {/* Use fluid container */}
      {/* Section 1: Perfumes */}
      <Row className="align-items-center m-0">
        {" "}
        {/* Remove gutters */}
        <Col md={6} className="p-0">
          {" "}
          {/* Remove padding */}
          <Carousel interval={4000} indicators={false}>
            <Carousel.Item>
              <img className="d-block w-100" src={perfume1} alt="Perfume 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={perfume2} alt="Perfume 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={perfume3} alt="Perfume 3" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={perfume4} alt="Perfume 4" />
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col md={6} style={heroStyle}>
          <h1 style={heroH1Style}>Perfumes of all kinds for you</h1>
          <p style={heroPStyle}>
            Discover our exquisite range of perfumes, crafted to perfection.
            Elevate your senses with enchanting fragrances that captivate and
            leave a lasting impression. Experience luxury in every spritz..
          </p>
          {/* Add Shop Now button if desired */}
          {/* <Button variant="primary" size="lg">Shop Perfumes</Button> */}
        </Col>
      </Row>
      {/* Section 2: Watches */}
      <Row className="align-items-center m-0">
        <Col md={6} style={heroStyle} className="order-md-1 order-2">
          {" "}
          {/* Text first on mobile */}
          <h1 style={heroH1Style}>We Got classic watch for you</h1>
          <p style={heroPStyle}>
            Timeless elegance meets modern craftsmanship. Explore our collection
            of classic watches, designed for sophistication and reliability.
            Make a statement with every second.
          </p>
        </Col>
        <Col md={6} className="p-0 order-md-2 order-1">
          {" "}
          {/* Image second on mobile */}
          <Carousel interval={4000} indicators={false}>
            <Carousel.Item>
              <img className="d-block w-100" src={watch1} alt="Watch 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={watch2} alt="Watch 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={watch3} alt="Watch 3" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={watch4} alt="Watch 4" />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
      {/* Section 3: Jeans */}
      <Row className="align-items-center m-0">
        <Col md={6} className="p-0">
          <Carousel interval={4000} indicators={false}>
            <Carousel.Item>
              <img className="d-block w-100" src={jeans1} alt="Jeans 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={jeans2} alt="Jeans 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={jeans3} alt="Jeans 3" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={jeans4} alt="Jeans 4" />
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col md={6} style={heroStyle}>
          <h1 style={heroH1Style}>We Got Jeans for you</h1>
          <p style={heroPStyle}>
            Premium jeans collection! Crafted for comfort and style, our jeans
            offer a perfect fit and durable quality. Elevate your wardrobe with
            trendy designs and timeless classics. Shop now!
          </p>
        </Col>
      </Row>
      {/* Section 4: Shirts */}
      <Row className="align-items-center m-0">
        <Col md={6} style={heroStyle} className="order-md-1 order-2">
          <h1 style={heroH1Style}>Shirts that fits well the body</h1>
          <p style={heroPStyle}>
            Upgrade your wardrobe with our premium collection of shirts!
            Unmatched comfort, stylish designs, and top-notch quality. Perfect
            for any occasion. Shop now and experience the difference in style.
          </p>
        </Col>
        <Col md={6} className="p-0 order-md-2 order-1">
          <Carousel interval={4000} indicators={false}>
            <Carousel.Item>
              <img className="d-block w-100" src={shirt1} alt="Shirt 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={shirt2} alt="Shirt 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={shirt3} alt="Shirt 3" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={shirt4} alt="Shirt 4" />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
      {/* Section 5: Shop With Us */}
      <Row className="align-items-center m-0">
        <Col md={6} className="p-0">
          <Carousel interval={4000} indicators={false}>
            <Carousel.Item>
              <img className="d-block w-100" src={mixed1} alt="Mixed 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={mixed2} alt="Mixed 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={shirt1} alt="Mixed 3" />{" "}
              {/* Reusing shirt1 */}
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={mixed4} alt="Mixed 4" />
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col md={6} style={heroStyle}>
          <h1 style={heroH1Style}>SHOP WITH US</h1>
          <p style={heroPStyle}>
            Explore our diverse collection. From premium jeans crafted for
            comfort and style to exquisite perfumes that captivate the senses.
            Upgrade your wardrobe with stylish shirts perfect for any occasion.
            Find timeless classics and trendy designs all in one place. Shop
            now!
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
