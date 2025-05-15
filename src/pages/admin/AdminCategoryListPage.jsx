import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { getAllAdminCategories, deleteCategory } from '../../services/adminCategoryService'; // Use the admin specific service
import { useAuth } from '../../context/AuthContext'; // For role checking

const AdminCategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Protected Route Logic (simplified here, ideally in a wrapper component)
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login'); // Or to an unauthorized page
    }
  }, [isAdmin, navigate]);


  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    setDeleteError('');
    setDeleteSuccess('');
    try {
      const data = await getAllAdminCategories();
      setCategories(data || []);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) { // Only fetch if admin
        fetchCategories();
    }
  }, [isAdmin]); // Re-fetch if isAdmin status changes (e.g., on login/logout)

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
    setDeleteError('');
    setDeleteSuccess('');
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      setDeleteSuccess(`Category "${categoryToDelete.name}" deleted successfully.`);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories(); // Refresh the list
    } catch (err) {
        const errorMsg = err.response?.data?.errorMessage || err.response?.data?.Message || 'Failed to delete category. It might be in use.';
        setDeleteError(errorMsg);
        setShowDeleteModal(false); // Close modal on error or keep it open for user to see message
        console.error(err);
    }
  };

  if (!isAdmin()) {
    return <Container><Alert variant="danger">Access Denied. You must be an admin to view this page.</Alert></Container>;
  }

  return (
    <Container className="mt-4 admin-page-container"> {/* Add a class for potential page-specific styling */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Categories</h2>
        <Button as={Link} to="/admin/categories/add" variant="primary">
          <i className="fas fa-plus mr-2"></i> Add Category
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {deleteError && <Alert variant="danger">{deleteError}</Alert>}
      {deleteSuccess && <Alert variant="success">{deleteSuccess}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading categories...</span>
          </Spinner>
        </div>
      ) : categories.length === 0 ? (
        <Alert variant="info">No categories found.</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="thead-light">
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/admin/categories/edit/${category.id}`}
                    variant="warning"
                    size="sm"
                    className="mr-2" // Bootstrap 4 margin
                  >
                    <i className="fas fa-edit"></i> Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the category "<strong>{categoryToDelete?.name}</strong>"?
          This action cannot be undone.
          {deleteError && <Alert variant="danger" className="mt-3">{deleteError}</Alert>}
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

export default AdminCategoryListPage;