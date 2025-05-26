import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Spinner, Alert, Badge, Card, Form, InputGroup } from 'react-bootstrap';
import ProductCard from '../components/product/ProductCard';
import { getAllProducts, getProductsByCategory } from '../services/productService';
import { getAllCategories } from '../services/categoryService';

const ShopPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('All Products');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  // Apply page-specific body class for styling
  useEffect(() => {
    document.body.classList.add('shop-page-body');
    return () => {
      document.body.classList.remove('shop-page-body');
    };
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(prevError => prevError ? `${prevError} Failed to load categories.` : 'Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products based on categoryId or all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);

      try {
        let fetchedProducts;
        if (categoryId) {
          fetchedProducts = await getProductsByCategory(categoryId);
          const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));
          setSelectedCategoryName(currentCategory ? currentCategory.name : `Category ID: ${categoryId}`);
        } else {
          fetchedProducts = await getAllProducts();
          setSelectedCategoryName('All Products');
        }
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoadingProducts(false);
      }
    };

    if (!loadingCategories) {
        fetchProducts();
    } else if (categoryId && categories.length === 0) {
        fetchProducts();
    }
  }, [categoryId, categories, loadingCategories]);

  const handleCategoryClick = (catId) => {
    if (catId) {
      navigate(`/shop/category/${catId}`);
    } else {
      navigate('/shop');
    }
  };

  const CategorySkeleton = () => (
    <div className="category-skeleton">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-item mb-2 p-3 rounded"></div>
      ))}
    </div>
  );

  const ProductsSkeleton = () => (
    <Row xs={1} sm={2} lg={3} className="g-4">
      {[...Array(6)].map((_, i) => (
        <Col key={i} className="mb-4">
          <div className="product-skeleton">
            <div className="skeleton-image mb-3"></div>
            <div className="skeleton-text mb-2"></div>
            <div className="skeleton-text-small mb-2"></div>
            <div className="skeleton-button"></div>
          </div>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      <style jsx>{`
        .shop-container {
          padding: 2rem 0;
          min-height: 80vh;
        }

        .category-sidebar {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 2rem;
          transition: all 0.3s ease;
        }

        .category-sidebar:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .category-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-title::before {
          content: '🏷️';
          font-size: 1.1rem;
        }

        .category-list .list-group-item {
          border: none;
          border-radius: 12px !important;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(5px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          font-weight: 500;
          padding: 0.875rem 1.25rem;
          position: relative;
          overflow: hidden;
        }

        .category-list .list-group-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
          z-index: -1;
        }

        .category-list .list-group-item:hover {
          transform: translateX(8px);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .category-list .list-group-item:hover::before {
          width: 100%;
        }

        .category-list .list-group-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .category-list .list-group-item.active::before {
          width: 100%;
        }

        .products-section {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          min-height: 60vh;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .section-title {
          color: #2c3e50;
          font-weight: 700;
          font-size: 2rem;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .products-count {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 0.3rem solid #f3f4f6;
          border-top: 0.3rem solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: #6b7280;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .empty-state-text {
          font-size: 1rem;
          opacity: 0.8;
        }

        .products-grid {
          gap: 1.5rem !important;
        }

        .product-card-wrapper {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card-wrapper:hover {
          transform: translateY(-8px);
        }

        .alert-enhanced {
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-weight: 500;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .alert-danger.alert-enhanced {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
        }

        .alert-info.alert-enhanced {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
          color: white;
        }

        /* Skeleton Loading Styles */
        .skeleton-item {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 48px;
        }

        .product-skeleton {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .skeleton-image {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 200px;
          border-radius: 8px;
        }

        .skeleton-text {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 20px;
          border-radius: 4px;
        }

        .skeleton-text-small {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 16px;
          width: 60%;
          border-radius: 4px;
        }

        .skeleton-button {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          height: 36px;
          border-radius: 6px;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .category-skeleton {
          padding: 1rem;
        }

        @media (max-width: 768px) {
          .shop-container {
            padding: 1rem 0;
          }
          
          .category-sidebar {
            margin-bottom: 2rem;
            position: static;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="shop-container">
        <Row>
          <Col md={3} className="mb-4">
            <div className="category-sidebar">
              <h4 className="category-title">Categories</h4>
              {loadingCategories ? (
                <CategorySkeleton />
              ) : categories.length > 0 ? (
                <ListGroup className="category-list">
                  <ListGroup.Item
                    action
                    onClick={() => handleCategoryClick(null)}
                    active={!categoryId}
                  >
                    All Products
                  </ListGroup.Item>
                  {categories.map((category) => (
                    <ListGroup.Item
                      action
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      active={parseInt(categoryId) === category.id}
                    >
                      {category.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📂</div>
                  <div className="empty-state-title">No Categories</div>
                  <div className="empty-state-text">Categories will appear here</div>
                </div>
              )}
            </div>
          </Col>

          <Col md={9}>
            <div className="products-section">
              <div className="section-header">
                <h3 className="section-title">{selectedCategoryName}</h3>
                {!loadingProducts && products.length > 0 && (
                  <Badge className="products-count">
                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                  </Badge>
                )}
              </div>

              {error && (
                <Alert variant="danger" className="alert-enhanced">
                  <strong>Oops!</strong> {error}
                </Alert>
              )}

              {loadingProducts ? (
                <ProductsSkeleton />
              ) : products.length > 0 ? (
                <Row xs={1} sm={2} lg={3} className="products-grid g-4">
                  {products.map((product) => (
                    <Col key={product.id} className="mb-4 d-flex align-items-stretch">
                      <div className="product-card-wrapper w-100">
                        <ProductCard product={product} cardClassName="product-card-shop" />
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🛍️</div>
                  <div className="empty-state-title">No Products Found</div>
                  <div className="empty-state-text">
                    {categoryId 
                      ? "This category doesn't have any products yet." 
                      : "No products are available at the moment."
                    }
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ShopPage;