import React, { useState } from 'react';
import axios from 'axios';
import QrReader from 'react-qr-scanner';

const VerifyProduct = () => {
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setProductId(data);
      setScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleVerify = async () => {
    try {
      const res = await axios.get(`/api/verify/${productId}`);
      setResult(res.data);
    } catch (error) {
      setResult({ authentic: false, message: 'Verification failed' });
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Verify Product</h2>
        <div className="mb-3">
          <label>Product ID</label>
          <input
            type="text"
            className="form-control"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary me-2" onClick={() => setScanning(!scanning)}>
          {scanning ? 'Stop Scanning' : 'Scan QR Code'}
        </button>
        <button className="btn btn-primary" onClick={handleVerify}>Verify</button>
        {scanning && (
          <div className="mt-3">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
        )}
        {result && (
          <div className={`mt-4 alert ${result.authentic ? 'alert-success' : 'alert-danger'}`}>
            {result.authentic ? 'Product is authentic!' : result.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyProduct;