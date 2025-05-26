import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner, Alert, Row, Col, Image as BootstrapImage } from 'react-bootstrap';
import { createProduct, getProductByIdAdmin, updateProduct } from '../../services/adminProductService';
import { getAllAdminCategories } from '../../services/adminCategoryService'; // Using admin service for categories
import { useAuth } from '../../context/AuthContext';
import placeholderImage from '../../assets/images/logo2.jpg'; // CORRECTED PLACEHOLDER


const AdminProductFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [productData, setProductData] = useState({
    name: '',
    categoryId: '',
    price: '',
    weight: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(placeholderImage);
  // const [existingImageName, setExistingImageName] = useState(''); // No longer strictly needed if relying on originalImageUrlForEdit
  const [originalImageUrlForEdit, setOriginalImageUrlForEdit] = useState(''); // To store original full URL for edit

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = Boolean(productId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getAllAdminCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error("Failed to fetch categories for form", err);
        setError("Could not load categories for the form.");
      }
    };
    if (isAdmin()) {
        fetchCategories();
    }
  }, [isAdmin]);


  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      setPageLoading(true);
      const fetchProduct = async () => {
        try {
          const data = await getProductByIdAdmin(productId); // Service returns ProductDto
          if (data) {
            setProductData({
              name: data.name || '',
              categoryId: data.categoryId?.toString() || '',
              price: data.price?.toString() || '',
              weight: data.weight?.toString() || '',
              description: data.description || '',
            });
            if (data.imageUrl) {
              setImagePreview(data.imageUrl);
              setOriginalImageUrlForEdit(data.imageUrl); // Store full original URL
              // setExistingImageName(data.imageName || ''); // Store raw name if needed for other logic
            } else {
              setImagePreview(placeholderImage);
              setOriginalImageUrlForEdit('');
            }
          } else {
            setError('Product not found.');
          }
        } catch (err) {
          setError('Failed to fetch product details.');
          console.error(err);
        } finally {
          setPageLoading(false);
        }
      };
      fetchProduct();
    } else {
      // Reset form for add mode
      setProductData({ name: '', categoryId: '', price: '', weight: '', description: '' });
      setImagePreview(placeholderImage);
      setSelectedFile(null);
      // setExistingImageName('');
      setOriginalImageUrlForEdit('');
    }
  }, [isAdmin, navigate, isEditMode, productId]);

  useEffect(() => {
    document.body.classList.add('admin-page-body');
    return () => {
        document.body.classList.remove('admin-page-body');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview of newly selected image
    } else {
      // If file selection is cancelled, revert to original image (if editing) or placeholder
      setImagePreview(isEditMode && originalImageUrlForEdit ? originalImageUrlForEdit : placeholderImage);
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (f) => {
    f.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!productData.name.trim() || !productData.categoryId || !productData.price) {
        setError('Name, Category, and Price are required.');
        setLoading(false);
        return;
    }
    if (parseFloat(productData.price) <= 0) {
        setError('Price must be greater than zero.');
        setLoading(false);
        return;
    }
     if (!isEditMode && !selectedFile) {
        setError('Product image is required for new products.');
        setLoading(false);
        return;
    }

    const fd = new FormData();
    fd.append('name', productData.name);
    fd.append('categoryId', parseInt(productData.categoryId, 10));
    fd.append('price', parseFloat(productData.price));
    fd.append('weight', parseFloat(productData.weight || '0'));
    fd.append('description', productData.description);

    if (selectedFile) {
      fd.append('imageFile', selectedFile); // Backend expects "imageFile"
    }
    // If not selectedFile, backend update logic should retain existing image if no new file is sent

    try {
      if (isEditMode) {
        await updateProduct(productId, fd);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(fd);
        setSuccess('Product created successfully!');
        setProductData({ name: '', categoryId: '', price: '', weight: '', description: '' });
        setSelectedFile(null);
        setImagePreview(placeholderImage);
        if (f.target.elements.imageFileCtrl) f.target.elements.imageFileCtrl.value = null; // Clear file input by controlId
      }
      setTimeout(() => navigate('/admin/products'), 1500);

    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.Message ||
                       err.response?.data?.Message ||
                       err.response?.data?.message ||
                       err.response?.data?.title ||
                       (isEditMode ? 'Failed to update product.' : 'Failed to create product.');
      setError(errorMsg);
      console.error("Submit error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return <Container><Alert variant="danger">Access Denied.</Alert></Container>;
  }

  if (pageLoading && isEditMode) {
    return (
      <Container className="text-center mt-5 admin-page-container">
        <Spinner animation="border" /><p>Loading product details...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4 admin-page-container">
      <h3>{isEditMode ? 'Edit Product' : 'Add a new Product'}</h3>
      <hr/>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={7}>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Product Name" required disabled={loading}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="productCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select name="categoryId" value={productData.categoryId} onChange={handleChange} required disabled={loading || categories.length === 0}>
                <option value="">-- Select Category --</option>
                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </Form.Select>
            </Form.Group>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="productPrice"><Form.Label>Price</Form.Label><Form.Control type="number" name="price" value={productData.price} onChange={handleChange} placeholder="0.00" required step="0.01" min="0.01" disabled={loading}/></Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="productWeight"><Form.Label>Weight (grams)</Form.Label><Form.Control type="number" name="weight" value={productData.weight} onChange={handleChange} placeholder="0.000" step="0.001" min="0" disabled={loading}/></Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="productDescription"><Form.Label>Description</Form.Label><Form.Control as="textarea" name="description" rows={5} value={productData.description} onChange={handleChange} placeholder="Product description..." disabled={loading}/></Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3" controlId="imageFileCtrl">
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" name="imageFile" accept="image/jpeg, image/png" onChange={handleFileChange} disabled={loading} />
              <Form.Text muted>Upload JPG/PNG. {!isEditMode && "Required."}</Form.Text>
            </Form.Group>
            {imagePreview && (<div className="mt-2 text-center"><p className="mb-1 small">Preview:</p><BootstrapImage src={imagePreview} alt="Preview" thumbnail style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} /></div>)}
          </Col>
        </Row>
        <hr/>
        <Button variant="primary" type="submit" disabled={loading || pageLoading} className="mr-2">{loading ? <Spinner as="span" animation="border" size="sm" /> : (isEditMode ? 'Update Product' : 'Add Product')}</Button>
        <Button variant="secondary" as={Link} to="/admin/products" disabled={loading || pageLoading}>Cancel</Button>
      </Form>
    </Container>
  );
};

export default AdminProductFormPage;