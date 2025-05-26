import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getAllAdminUsers } from '../../services/adminUserService'; // Ensure this service exists
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api'; // For constructing download URLs

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL_FOR_DOWNLOAD = apiClient.defaults.baseURL?.replace('/api', ''); // Get http://localhost:5270 part

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
    } else {
      fetchUsers();
    }
    document.body.classList.add('admin-page-body');
    return () => {
        document.body.classList.remove('admin-page-body');
    };
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAdminUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users. Please try again.');
      console.error("Fetch Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return <Container><Alert variant="danger">Access Denied. Admins only.</Alert></Container>;
  }

  return (
    <Container className="mt-5 admin-page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users List</h2>
        <div>
          <Button
            variant="primary"
            href={`${API_BASE_URL_FOR_DOWNLOAD}/api/admin/users/pdf`} // Correct full URL
            target="_blank"
            rel="noopener noreferrer" // Good practice for target="_blank"
            className="mr-2"
            // download attribute is a hint, Content-Disposition from server is key
          >
            <i className="fas fa-file-pdf mr-2"></i>Download PDF
          </Button>
          <Button
            variant="secondary"
            href={`${API_BASE_URL_FOR_DOWNLOAD}/api/admin/users/csv`} // Correct full URL
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            <i className="fas fa-file-csv mr-2"></i>Download CSV
          </Button>
          <Button as={Link} to="/admin" variant="info">
            <i className="fas fa-tachometer-alt mr-2"></i>Admin Home
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminUserListPage;