import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-tight text-cyan-300 transition hover:text-cyan-200">
          Fake Product System
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 p-2 text-slate-200 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Open navigation</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>

        <nav className={`absolute inset-x-4 top-full mt-2 rounded-3xl border border-slate-800 bg-slate-950/98 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl transition-all duration-300 sm:static sm:flex sm:w-auto sm:items-center sm:gap-4 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none ${open ? 'block' : 'hidden'}`}>
          <Link to="/" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-200 sm:inline-flex sm:px-2">
            Home
          </Link>
          <Link to="/verify-product" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-200 sm:inline-flex sm:px-2">
            Verify
          </Link>
          {token ? (
            <>
              <Link to="/add-product" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-200 sm:inline-flex sm:px-2">
                Add Product
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-200 sm:inline-flex sm:px-2">
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-cyan-200 sm:inline-flex sm:px-2">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
