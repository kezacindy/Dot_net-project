import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Modal, Image as BootstrapImage } from 'react-bootstrap'; // Renamed Image
import { getAllAdminProducts, deleteProduct } from '../../services/adminProductService';
import { useAuth } from '../../context/AuthContext';
import placeholderImage from '../../assets/images/logo2.jpg'; // CORRECTED PLACEHOLDER

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setDeleteError('');
    setDeleteSuccess('');
    try {
      const data = await getAllAdminProducts();
      setProducts(data || []);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchProducts();
    }
  }, [isAdmin]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    setDeleteError('');
    setDeleteSuccess('');
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      setDeleteSuccess(`Product "${productToDelete.name}" deleted successfully.`);
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts(); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.Message || 'Failed to delete product.';
      setDeleteError(errorMsg);
      console.error(err);
    }
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  useEffect(() => {
    document.body.classList.add('admin-page-body');
    return () => {
        document.body.classList.remove('admin-page-body');
    };
  }, []);


  if (!isAdmin()) {
    return <Container><Alert variant="danger">Access Denied. Admins only.</Alert></Container>;
  }

  return (
    <Container className="mt-4 admin-page-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Products</h2>
        <Button as={Link} to="/admin/products/add" variant="primary">
          <i className="fas fa-plus mr-2"></i> Add Product
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {deleteError && <Alert variant="danger" onClose={() => setDeleteError('')} dismissible>{deleteError}</Alert>}
      {deleteSuccess && <Alert variant="success" onClose={() => setDeleteSuccess('')} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center"><Spinner animation="border" /><p>Loading products...</p></div>
      ) : products.length === 0 ? (
        <Alert variant="info">No products found. <Link to="/admin/products/add">Add one now!</Link></Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="thead-light">
            <tr><th>#</th><th>Preview</th><th>Product Name</th><th>Category</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  <BootstrapImage
                    src={product.imageUrl || placeholderImage}
                    alt={product.name}
                    onError={handleImageError}
                    style={{ height: '70px', width: '70px', objectFit: 'cover' }}
                    thumbnail
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.categoryName || 'N/A'}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/admin/products/edit/${product.id}`}
                    variant="warning"
                    size="sm"
                    className="mr-2 mb-1 mb-md-0"
                  >
                    <i className="fas fa-edit"></i> Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "<strong>{productToDelete?.name}</strong>"? This action cannot be undone.
          {deleteError && showDeleteModal && <Alert variant="danger" className="mt-3">{deleteError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProductListPage;