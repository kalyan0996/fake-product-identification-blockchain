import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', formData);
      setError('');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-10">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Create account</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">Register as a product manufacturer</h1>
        <p className="mx-auto max-w-xl text-sm leading-6 text-slate-400">Securely add products to the blockchain and generate QR codes for trusted verification.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>

      {error && <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

      <p className="mt-6 text-center text-sm text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-cyan-300 transition hover:text-cyan-200">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
