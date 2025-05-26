import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
// Make sure Jumbotron is removed if not available, or use an alternative
import { Container, Row, Col, Card, Button /* Remove Jumbotron if not present */ } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2'; // Ensure this is installed
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'; // Ensure this is installed

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Sample data for Product Sales (static for now)
const salesData = {
    labels: ["June", "July", "August", "September", "October", "November"],
    datasets: [{
        label: "Sales",
        data: [120, 150, 300, 500, 250, 400],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0.1
    }]
};

const salesConfig = {
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true }
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        }
    }
};

// Sample data for Category Distribution (static for now)
const categoryData = {
    labels: ["T-shirts", "Watch", "Pants", "Perfume", "Socks"],
    datasets: [{
        label: 'Category Distribution',
        data: [30, 20, 25, 15, 10],
        backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)"
        ],
        borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1
    }]
};

const categoryConfig = {
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        }
    }
};


const AdminDashboardPage = () => {
    useEffect(() => {
        document.body.classList.add('admin-dashboard-body');
        return () => {
            document.body.classList.remove('admin-dashboard-body');
        };
    }, []);

    return (
        <div className="admin-dashboard-page-content">
            <Container fluid className="pt-3">
                <Row className="mb-4">
                    <Col md={12} lg={6}>
                        {/* Replace Jumbotron with a styled div */}
                        <div className="p-5 mb-4 bg-light rounded-3 text-dark jumbotron-replacement"> {/* Add text-dark if bg-light */}
                            <Container fluid className="py-3 text-center"> {/* Reduced padding */}
                                <h1 className="display-5 fw-bold">Welcome Admin!</h1> {/* display-5 for smaller heading */}
                                <p className="fs-5"> {/* fs-5 for smaller paragraph */}
                                    Manage products, categories, and monitor site performance.
                                </p>
                            </Container>
                        </div>
                    </Col>
                    <Col md={12} lg={6}>
                        <Row>
                            <Col sm={6} className="mb-3">
                                <Card>
                                    <Card.Body className="text-center">
                                        <Card.Title as="h4">Categories</Card.Title>
                                        <Card.Text>Manage categories section here.</Card.Text>
                                        <Button as={Link} to="/admin/categories" variant="primary">Manage</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={6} className="mb-3">
                                <Card>
                                    <Card.Body className="text-center">
                                        <Card.Title as="h4">Products</Card.Title>
                                        <Card.Text>Manage all the products here.</Card.Text>
                                        <Button as={Link} to="/admin/products" variant="primary">Manage</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={6} className="mb-3 pt-sm-0 pt-md-3">
                                <Card>
                                    <Card.Body className="text-center">
                                        <Card.Title as="h4">Users</Card.Title>
                                        <Card.Text>Manage the list of users here.</Card.Text>
                                        <Button as={Link} to="/admin/users" variant="primary">View Users</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="mb-4">
                        <div className="chart-container" style={{ height: '350px', position: 'relative' }}>
                            <h5 className="text-center">Product Sales (Last 6 Months)</h5>
                            <Line data={salesData} options={salesConfig.options} />
                        </div>
                    </Col>
                    <Col md={6} className="mb-4">
                        <div className="chart-container" style={{ height: '350px', position: 'relative' }}>
                            <h5 className="text-center">Category Distribution</h5>
                            <Doughnut data={categoryData} options={categoryConfig.options} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminDashboardPage;