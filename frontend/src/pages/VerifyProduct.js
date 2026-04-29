import React, { useState } from 'react';
import axios from 'axios';
import QrReader from 'react-qr-scanner';

const VerifyProduct = () => {
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = (data) => {
    if (data) {
      setProductId(String(data));
      setScanning(false);
      setError('');
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Camera access is unavailable. Please try again or enter the product ID manually.');
  };

  const handleVerify = async () => {
    if (!productId.trim()) {
      setError('Please provide a product ID before verifying.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/verify/${productId}`);
      setResult(res.data);
    } catch (error) {
      setResult({ authentic: false, message: 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Product verification</p>
          <h1 className="text-3xl font-semibold text-slate-100">Confirm authenticity in seconds</h1>
          <p className="text-slate-400">Enter a product ID or scan a QR code to verify whether the product is part of your blockchain ledger.</p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-200">Product ID</label>
            <input
              type="text"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setScanning(!scanning)}
              className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200"
            >
              {scanning ? 'Stop scanning' : 'Scan QR code'}
            </button>
            <button
              type="button"
              onClick={handleVerify}
              className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </div>

          {scanning && (
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-2 shadow-xl shadow-cyan-500/10">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-black">
                <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-cyan-400/60" />
                <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {error && <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

          {result && (
            <div className={`rounded-[1.75rem] border p-5 ${result.authentic ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100' : 'border-rose-500/30 bg-rose-500/10 text-rose-100'}`}>
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">
                  {result.authentic ? '✓' : '✕'}
                </span>
                {result.authentic ? 'Product is authentic!' : result.message}
              </div>
              {result.authentic && result.product && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Product Name</p>
                    <p className="mt-2 text-sm font-medium text-slate-100">{result.product.name}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Product ID</p>
                    <p className="mt-2 text-sm font-medium text-slate-100">{result.product.productId}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Verification guide</p>
          <h2 className="text-2xl font-semibold text-slate-100">How to verify</h2>
          <ul className="space-y-4 text-sm leading-6 text-slate-400">
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">Enter the product ID manually if scanning is unavailable.</li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">Use the camera scan for faster, contactless verification.</li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">A green result means the product was found on the blockchain ledger.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default VerifyProduct;
