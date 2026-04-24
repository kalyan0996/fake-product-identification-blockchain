import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [qrCode, setQrCode] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const clearTokenAndRedirect = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchProducts = async () => {
    try {
      if (!token) {
        setError('Please login to add and view products.');
        return;
      }
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to load products';
      setError(message);
      if (message === 'Invalid token' || message === 'No token provided') {
        clearTokenAndRedirect();
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        setError('You must be logged in to add a product.');
        navigate('/login');
        return;
      }
      const res = await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrCode(res.data.qrCode);
      setProducts((prev) => [res.data.product, ...prev]);
      setFormData({ name: '', description: '' });
      setError('');
      alert('Product added successfully');
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add product';
      setError(message);
      if (message === 'Invalid token' || message === 'No token provided') {
        clearTokenAndRedirect();
      }
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Product Name</label>
            <input type="text" name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea name="description" className="form-control" onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {qrCode && (
          <div className="mt-4">
            <h3>QR Code</h3>
            <img src={qrCode} alt="QR Code" />
          </div>
        )}
        <div className="mt-4">
          <h3>My Products</h3>
          {products.length === 0 ? (
            <p>No products added yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;