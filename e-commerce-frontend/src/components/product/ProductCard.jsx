import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import placeholderImage from '../../assets/images/logo2.jpg'; // Generic placeholder

const ProductCard = ({ product, cardClassName = '' }) => {
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    e.target.src = placeholderImage;
  };

  // Default currency - can be moved to a config/util if needed
  const currencySymbol = 'rwf';

  return (
    // Add h-100 for equal height cards if they are in a Bootstrap Row/Col layout
    <Card className={`h-100 shadow-sm ${cardClassName}`}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <Card.Img
          variant="top"
          src={product.imageUrl || placeholderImage}
          alt={product.name}
          className="card-img-top-custom" // For custom image styling (max-height, object-fit)
          onError={handleImageError}
          style={{ aspectRatio: '1 / 1', objectFit: 'cover' }} // Maintain aspect ratio
        />
      </Link>
      <Card.Body className="d-flex flex-column"> {/* For aligning button to bottom */}
        <Card.Title>
          <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">
            {product.name}
          </Link>
        </Card.Title>
        <Card.Text as="h5" className="text-primary mb-2">
          {currencySymbol} {product.price ? product.price.toFixed(2) : 'N/A'}
        </Card.Text>
        {/* Optional: Show category if relevant here */}
        {/* <Card.Text className="text-muted small mb-2">{product.categoryName}</Card.Text> */}
        <Card.Text className="text-muted flex-grow-1 small">
          {product.description
            ? (product.description.length > 80 ? `${product.description.substring(0, 80)}...` : product.description)
            : 'No description available.'}
        </Card.Text>
        <Button
          as={Link}
          to={`/product/${product.id}`}
          variant="primary"
          className="mt-auto align-self-start" // Align button to bottom and start
        >
          View Product
        </Button>
        {/* Add "Add to Cart" button later - needs CartContext and cartService */}
        {/* <Button variant="success" className="mt-2">Add to Cart</Button> */}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;