import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image as BootstrapImage, Button, Spinner, Alert, Badge, Card } from 'react-bootstrap';
import { getProductById } from '../services/productService';
import placeholderImageFromAssets from '../assets/images/placeholder.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const {
    addItemToCart,
    loading: cartLoading,
    error: cartError,
    successMessage: cartSuccessMessage,
    clearCartError,
    clearCartSuccessMessage
  } = useCart();

  const { isAuthenticated } = useAuth();

  // Apply page-specific body class
  useEffect(() => {
    document.body.classList.add('product-detail-page-body');
    return () => {
      document.body.classList.remove('product-detail-page-body');
    };
  }, []);

  // Fetch product details when component mounts or productId changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setFetchError(null);
      if (clearCartError) clearCartError();
      if (clearCartSuccessMessage) clearCartSuccessMessage();
      try {
        const data = await getProductById(productId);
        if (data) {
          setProduct(data);
        } else {
          setFetchError('Product not found.');
        }
      } catch (err) {
        setFetchError('Failed to fetch product details. Please try again.');
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    } else {
      setFetchError('No product ID provided.');
      setLoading(false);
    }
  }, [productId, clearCartError, clearCartSuccessMessage]);

  // Cleanup cart messages on unmount
  useEffect(() => {
    return () => {
      if (clearCartError) clearCartError();
      if (clearCartSuccessMessage) clearCartSuccessMessage();
    };
  }, [clearCartError, clearCartSuccessMessage]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImageFromAssets;
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleAddToCart = async () => {
    if (clearCartError) clearCartError();
    if (clearCartSuccessMessage) clearCartSuccessMessage();

    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${productId}`);
      return;
    }

    if (product) {
      try {
        await addItemToCart(product.id, 1);
      } catch (err) {
        console.error("Error adding to cart from ProductDetailPage:", err);
      }
    }
  };

  const ProductDetailSkeleton = () => (
    <div className="product-detail-skeleton">
      <Row>
        <Col md={5} className="mb-4 mb-md-0">
          <div className="skeleton-image-large"></div>
        </Col>
        <Col md={7}>
          <div className="skeleton-text-title mb-3"></div>
          <div className="skeleton-text mb-2"></div>
          <div className="skeleton-text-large mb-3"></div>
          <div className="skeleton-text mb-2"></div>
          <div className="skeleton-text-description mb-4"></div>
          <div className="skeleton-button"></div>
        </Col>
      </Row>
    </div>
  );

  const currencySymbol = 'RWF';

  return (
    <>
      <style jsx>{`
        .product-detail-container {
          padding: 2rem 0;
          min-height: 80vh;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .back-button {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 0.5rem 1rem;
          color: #495057;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          font-size: 0.9rem;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .back-button::before {
          content: '←';
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .back-button:hover::before {
          transform: translateX(-4px);
        }

        .product-detail-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .image-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .image-container:hover {
          transform: scale(1.01);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }

        .product-image {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: cover;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .image-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 249, 250, 0.9);
          backdrop-filter: blur(5px);
          border-radius: 12px;
        }

        .product-info {
          padding-left: 1.5rem;
        }

        .product-title {
          color: #2c3e50;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .category-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          color: #667eea;
          padding: 0.375rem 0.75rem;
          border-radius: 15px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(102, 126, 234, 0.2);
          margin-bottom: 1rem;
        }

        .category-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }

        .category-link::before {
          content: '🏷️';
          font-size: 0.8rem;
        }

        .price-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin: 1rem 0;
          box-shadow: 0 2px 15px rgba(102, 126, 234, 0.3);
          display: inline-block;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .weight-badge {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 10px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(116, 185, 255, 0.25);
          font-size: 0.85rem;
        }

        .weight-badge::before {
          content: '⚖️';
          font-size: 0.8rem;
        }

        .description {
          color: #495057;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(248, 249, 250, 0.7);
          border-radius: 10px;
          border-left: 3px solid #667eea;
        }

        .add-to-cart-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 3px 15px rgba(102, 126, 234, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          min-width: 160px;
          justify-content: center;
        }

        .add-to-cart-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .add-to-cart-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .add-to-cart-button::before {
          content: '🛒';
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .add-to-cart-button:hover:not(:disabled)::before {
          transform: scale(1.1);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          min-height: 60vh;
        }

        .loading-spinner {
          width: 4rem;
          height: 4rem;
          border: 0.4rem solid #f3f4f6;
          border-top: 0.4rem solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: #6b7280;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .error-container, .not-found-container {
          text-align: center;
          padding: 4rem 2rem;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .alert-enhanced {
          border: none;
          border-radius: 16px;
          padding: 1.5rem 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .alert-danger.alert-enhanced {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
        }

        .alert-success.alert-enhanced {
          background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
          color: white;
        }

        .alert-warning.alert-enhanced {
          background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
          color: white;
        }

        /* Skeleton Loading Styles */
        .product-detail-skeleton {
          padding: 2.5rem;
        }

        .skeleton-image-large {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 400px;
          border-radius: 16px;
        }

        .skeleton-text-title {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 40px;
          width: 70%;
          border-radius: 8px;
        }

        .skeleton-text {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 20px;
          width: 40%;
          border-radius: 4px;
        }

        .skeleton-text-large {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 32px;
          width: 30%;
          border-radius: 6px;
        }

        .skeleton-text-description {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 80px;
          border-radius: 8px;
        }

        .skeleton-button {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 48px;
          width: 200px;
          border-radius: 16px;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .product-detail-container {
            padding: 1rem 0;
          }
          
          .product-detail-card {
            padding: 1rem;
          }
          
          .product-info {
            padding-left: 0;
            margin-top: 1.5rem;
          }
          
          .product-title {
            font-size: 1.75rem;
          }
          
          .price {
            font-size: 1.25rem;
          }
          
          .add-to-cart-button {
            width: 100%;
            padding: 1rem;
          }
        }
      `}</style>

      <Container className="product-detail-container">
        <Link to="/shop" className="back-button">
          Back to Shop
        </Link>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading product details...</p>
          </div>
        ) : fetchError ? (
          <div className="error-container">
            <Alert variant="danger" className="alert-enhanced">{fetchError}</Alert>
            <Button as={Link} to="/shop" variant="secondary" size="lg">Back to Shop</Button>
          </div>
        ) : !product ? (
          <div className="not-found-container">
            <Alert variant="warning" className="alert-enhanced">Product data is not available.</Alert>
            <Button as={Link} to="/shop" variant="secondary" size="lg">Back to Shop</Button>
          </div>
        ) : (
          <div className="product-detail-card">
            {/* Display feedback from CartContext operations */}
            {cartError && !cartLoading && (
              <Alert variant="danger" onClose={clearCartError} dismissible className="alert-enhanced mb-4">
                <strong>Error!</strong> {cartError}
              </Alert>
            )}
            {cartSuccessMessage && !cartLoading && (
              <Alert variant="success" onClose={clearCartSuccessMessage} dismissible className="alert-enhanced mb-4">
                <strong>Success!</strong> {cartSuccessMessage}
              </Alert>
            )}

            <Row>
              <Col md={5} className="mb-4 mb-md-0">
                <div className="image-container">
                  {imageLoading && (
                    <div className="image-loading-overlay">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  )}
                  <BootstrapImage
                    src={product.imageUrl || placeholderImageFromAssets}
                    alt={product.name}
                    className="product-image"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    fluid
                  />
                </div>
              </Col>
              <Col md={7} className="product-info">
                <h1 className="product-title">{product.name}</h1>
                
                {product.categoryName && (
                  <Link to={`/shop/category/${product.categoryId}`} className="category-link">
                    {product.categoryName}
                  </Link>
                )}

                <div className="price-container">
                  <h2 className="price">
                    {currencySymbol} {product.price ? product.price.toFixed(2) : 'N/A'}
                  </h2>
                </div>

                {product.weight > 0 && (
                  <div className="weight-badge">
                    {product.weight}g
                  </div>
                )}

                <div className="description">
                  {product.description || 'No description available.'}
                </div>

                <Button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};

export default ProductDetailPage;