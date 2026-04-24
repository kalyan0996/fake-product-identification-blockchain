import React from 'react';

const Home = () => {
  return (
    <div className="text-center">
      <h1>Welcome to Fake Product Identification System</h1>
      <p>This system uses blockchain technology to ensure product authenticity.</p>
      <div className="row mt-4">
        <div className="col-md-4">
          <h3>Manufacturers</h3>
          <p>Register and add your products to the blockchain.</p>
        </div>
        <div className="col-md-4">
          <h3>Consumers</h3>
          <p>Scan QR codes or enter product IDs to verify authenticity.</p>
        </div>
        <div className="col-md-4">
          <h3>Blockchain</h3>
          <p>Immutable ledger ensures data integrity.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;