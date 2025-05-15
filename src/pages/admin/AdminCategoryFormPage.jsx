import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { createCategory, getCategoryByIdAdmin, updateCategory } from '../../services/adminCategoryService';
import { useAuth } from '../../context/AuthContext';

const AdminCategoryFormPage = () => {
  const { categoryId } = useParams(); // Will be undefined for 'add' mode
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false); // For fetching existing category
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = Boolean(categoryId);

  // Authorization and Fetching data for edit mode
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login'); // Or to an unauthorized page
      return;
    }

    if (isEditMode) {
      setPageLoading(true);
      const fetchCategory = async () => {
        try {
          const data = await getCategoryByIdAdmin(categoryId);
          if (data) {
            setCategoryName(data.name);
          } else {
            setError('Category not found.');
          }
        } catch (err) {
          setError('Failed to fetch category details.');
          console.error(err);
        } finally {
          setPageLoading(false);
        }
      };
      fetchCategory();
    }
  }, [isAdmin, navigate, isEditMode, categoryId]);


  // Apply specific body class for admin pages if needed
  useEffect(() => {
    document.body.classList.add('admin-page-body'); // Assuming a common admin style class
    return () => {
        document.body.classList.remove('admin-page-body');
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!categoryName.trim()) {
        setError('Category name cannot be empty.');
        setLoading(false);
        return;
    }

    const categoryData = { name: categoryName };

    try {
      if (isEditMode) {
        await updateCategory(categoryId, categoryData);
        setSuccess('Category updated successfully!');
      } else {
        await createCategory(categoryData);
        setSuccess('Category created successfully!');
        setCategoryName(''); // Clear form for next entry
      }
      // Optionally navigate back to categories list after a delay or on button click
      setTimeout(() => navigate('/admin/categories'), 1500);

    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.errorMessage || // ASP.NET Core default validation
                       err.response?.data?.Errors?.[0] || // From your DTO error handling
                       err.response?.data?.Message ||
                       err.response?.data?.message ||
                       (isEditMode ? 'Failed to update category.' : 'Failed to create category.');
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    // This might briefly show before useEffect redirects, or you can return null
    return <Container><Alert variant="danger">Access Denied.</Alert></Container>;
  }

  if (pageLoading && isEditMode) {
    return (
      <Container className="text-center mt-5 admin-page-container">
        <Spinner animation="border" />
        <p>Loading category details...</p>
      </Container>
    );
  }


  return (
    <Container className="mt-4 admin-page-container">
      <h2>{isEditMode ? 'Edit Category' : 'Add New Category'}</h2>
      <hr/>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row>
        <Col md={6}> {/* Limit form width */}
            <Form onSubmit={handleSubmit}>
                {/* Hidden ID field is not needed in React forms like in Thymeleaf */}
                {/* categoryId from URL is used for edit mode */}

                <Form.Group className="mb-3" controlId="categoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    disabled={loading || pageLoading}
                />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading || pageLoading} className="mr-2">
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : (isEditMode ? 'Update Category' : 'Add Category')}
                </Button>
                <Button variant="secondary" as={Link} to="/admin/categories" disabled={loading || pageLoading}>
                 Cancel
                </Button>
            </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCategoryFormPage;