import { Navigate } from 'react-router-dom';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-slate-200 mb-2">403</h1>
      <p className="text-slate-600 font-medium">You don't have permission to view this page.</p>
      <a href="/dashboard" className="btn btn-primary mt-6 inline-flex">Go to Dashboard</a>
    </div>
  </div>
);

export default Unauthorized;
