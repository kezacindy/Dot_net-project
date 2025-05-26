import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Modal, Image as BootstrapImage } from 'react-bootstrap';
import { getAllAdminProducts, deleteProduct } from '../../services/adminProductService';
import { useAuth } from '../../context/AuthContext';
import placeholderImageFromAssets from '../../assets/images/placeholder.png'; // CORRECTED PLACEHOLDER IMPORT

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For general fetch errors
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(''); // For errors during delete operation
  const [deleteSuccess, setDeleteSuccess] = useState(''); // For success message after delete

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    }
    // Apply admin page specific body class (if you have one like admin-page-body)
    document.body.classList.add('admin-page-body');
    return () => {
        document.body.classList.remove('admin-page-body');
    };
  }, [isAdmin, navigate]); // isAdmin is a dependency for the redirect logic

  const fetchProducts = async () => {
    setLoading(true);
    setError(null); // Clear general fetch error
    setDeleteError(''); // Clear previous operation messages
    setDeleteSuccess('');
    try {
      const data = await getAllAdminProducts();
      setProducts(data || []);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) { // Only fetch if user is admin
      fetchProducts();
    }
  }, [isAdmin]); // Re-fetch if isAdmin status changes (e.g., on login)

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    setDeleteError(''); // Clear previous errors when opening modal
    setDeleteSuccess('');
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteError(''); // Clear previous error
    setDeleteSuccess(''); // Clear previous success
    try {
      await deleteProduct(productToDelete.id);
      setDeleteSuccess(`Product "${productToDelete.name}" deleted successfully.`);
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh the list
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.Message || 'Failed to delete product.';
      setDeleteError(errorMsg);
      // Keep modal open to show error, or close it:
      // setShowDeleteModal(false);
      console.error("Confirm Delete Error:", err);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    e.target.src = placeholderImageFromAssets;
  };

  if (!isAdmin()) { // This check should be sufficient due to useEffect redirect
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

      {/* General fetch error */}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {/* Delete operation specific feedback */}
      {deleteError && <Alert variant="danger" onClose={() => setDeleteError('')} dismissible>{deleteError}</Alert>}
      {deleteSuccess && <Alert variant="success" onClose={() => setDeleteSuccess('')} dismissible>{deleteSuccess}</Alert>} {/* CORRECTED HERE */}


      {loading ? (
        <div className="text-center py-5"> {/* Added padding for better visual */}
          <Spinner animation="border" role="status" variant="primary"/>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Alert variant="info">No products found. <Link to="/admin/products/add">Add one now!</Link></Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="thead-light">
            <tr>
              <th>#</th>
              <th>Preview</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  <BootstrapImage
                    src={product.imageUrl || placeholderImageFromAssets}
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
                    className="mr-2 mb-1 mb-md-0" // Bootstrap 4 margin classes
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product "<strong>{productToDelete?.name}</strong>"?
          This action cannot be undone.
          {/* Show delete error inside modal if it occurred during confirmDelete */}
          {deleteError && showDeleteModal && <Alert variant="danger" className="mt-3">{deleteError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProductListPage;