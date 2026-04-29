import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [qrCode, setQrCode] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const clearTokenAndRedirect = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchProducts = async () => {
    if (!token) {
      setError('Please login to add and view products.');
      return;
    }

    setLoadingProducts(true);
    try {
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      setError('');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to load products';
      setError(message);
      if (message === 'Invalid token' || message === 'No token provided') {
        clearTokenAndRedirect();
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getErrorMessage = (err, fallback) => {
    const serverData = err.response?.data;
    if (serverData?.error) return serverData.error;
    if (serverData?.message) return serverData.message;
    if (err.message) return err.message;
    return fallback;
  };

  const handleEditClick = (product) => {
    setFormData({ name: product.name, description: product.description });
    setQrCode('');
    setEditingProductId(product.productId);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', description: '' });
    setEditingProductId('');
    setQrCode('');
    setError('');
    setSuccess('');
  };

  const handleDeleteProduct = async (productId) => {
    if (!token) {
      setError('Please login to delete a product.');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((product) => product.productId !== productId));
      if (editingProductId === productId) {
        handleCancelEdit();
      }
      setSuccess('Product deleted successfully.');
      setError('');
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to delete product');
      console.error('Delete product error', err.response || err.message || err);
      setError(message);
      if (message === 'Invalid token' || message === 'No token provided') {
        clearTokenAndRedirect();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to add or edit a product.');
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      if (editingProductId) {
        const res = await axios.put(`/api/products/${editingProductId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts((prev) => prev.map((product) => (product.productId === editingProductId ? res.data.product : product)));
        setSuccess('Product updated successfully.');
      } else {
        const res = await axios.post('/api/products', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQrCode(res.data.qrCode);
        setProducts((prev) => [res.data.product, ...prev]);
        setSuccess('Product added successfully. QR code generated below.');
      }
      setFormData({ name: '', description: '' });
      setEditingProductId('');
      setError('');
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to save product');
      console.error('Save product error', err.response || err.message || err);
      setError(message);
      if (message === 'Invalid token' || message === 'No token provided') {
        clearTokenAndRedirect();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Product creation</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">
              {editingProductId ? 'Edit product' : 'Add a new product'}
            </h1>
          </div>
          <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">Manufacturer only</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Product name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (editingProductId ? 'Saving changes...' : 'Saving...') : editingProductId ? 'Save Changes' : 'Add Product'}
            </button>
            {editingProductId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-3xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {error && <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
        {success && <div className="mt-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</div>}

        {qrCode && (
          <div className="mt-8 rounded-[1.75rem] border border-cyan-500/20 bg-slate-950/80 p-6 shadow-xl shadow-cyan-500/10">
            <h2 className="text-lg font-semibold text-slate-100">Generated QR Code</h2>
            <p className="mt-2 text-sm text-slate-400">Scan this code to verify product authenticity quickly.</p>
            <div className="mt-6 flex justify-center">
              <img src={qrCode} alt="Product QR Code" className="h-64 w-64 rounded-3xl border border-slate-800 bg-slate-950 p-2 shadow-xl shadow-cyan-500/10" />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">My products</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">Recent entries</h2>
          </div>
          <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">{products.length} items</span>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300 hidden md:table">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Product ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loadingProducts ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-4 w-32 rounded-full bg-slate-800" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-28 rounded-full bg-slate-800" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-48 rounded-full bg-slate-800" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 rounded-full bg-slate-800" /></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      No products added yet.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.productId} className="transition hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-medium text-slate-100">{product.productId}</td>
                      <td className="px-4 py-4">{product.name}</td>
                      <td className="px-4 py-4">{product.description}</td>
                      <td className="px-4 py-4 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(product)}
                          className="rounded-2xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.productId)}
                          className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-rose-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {products.length > 0 && (
            <div className="grid gap-4 p-4 md:hidden">
              {products.map((product) => (
                <div key={product.productId} className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-inner shadow-slate-950/10">
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-slate-400">ID</div>
                    <div className="font-medium text-slate-100">{product.productId}</div>
                    <div className="text-sm text-slate-400">Name</div>
                    <div className="text-slate-100">{product.name}</div>
                    <div className="text-sm text-slate-400">Description</div>
                    <div className="text-slate-200">{product.description}</div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(product)}
                        className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.productId)}
                        className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-rose-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && !loadingProducts && (
            <div className="px-4 py-8 text-center text-slate-400 md:hidden">
              No products added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AddProduct;
