// pages/LandingPage.tsx
'use client';

import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setHasToken(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
      {hasToken ? (
        <h1 className="text-2xl font-bold text-brand-primary">Masz token landing page</h1>
      ) : (
        <h1 className="text-2xl font-bold text-brand-primary">No token found</h1>
      )}
    </div>
  );
};

export default LandingPage;
