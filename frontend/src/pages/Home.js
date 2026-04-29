import React from 'react';

const Home = () => {
  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/85 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Blockchain product trust</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
              Identify genuine products with secure blockchain verification.
            </h1>
            <p className="max-w-2xl text-slate-300 sm:text-lg">
              Scan QR codes, verify product IDs, and manage product authenticity from a clean, modern dashboard.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-200 ring-1 ring-cyan-500/20">
                Secure supply chain verification
              </span>
              <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300 ring-1 ring-slate-700">
                Responsive design
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30 ring-1 ring-slate-800">
            <div className="grid gap-5">
              {[
                { title: 'Immutable ledger', description: 'Every product entry is stored with SHA-256 verification.' },
                { title: 'QR product trust', description: 'Scan or enter a product ID to confirm authenticity instantly.' },
                { title: 'Manufacturer control', description: 'Add products once authenticated with a secure account.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900">
                  <h2 className="text-lg font-semibold text-slate-100">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-slate-100">Manufacturers</h3>
          <p className="mt-3 text-slate-400">Register, add products, and generate QR codes that connect physical items to blockchain records.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-slate-100">Consumers</h3>
          <p className="mt-3 text-slate-400">Verify product authenticity instantly with a QR scan or by entering a product ID.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-slate-100">Blockchain</h3>
          <p className="mt-3 text-slate-400">Immutable records and cryptographic validation keep every product timestamped and tamper-proof.</p>
        </div>
      </div>
    </section>
  );
};

export default Home;
