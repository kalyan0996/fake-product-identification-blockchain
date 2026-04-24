import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Fake Product System</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Home</Link>
          {token ? (
            <>
              <Link className="nav-link" to="/add-product">Add Product</Link>
              <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
          <Link className="nav-link" to="/verify-product">Verify Product</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;