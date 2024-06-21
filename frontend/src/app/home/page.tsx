'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setHasToken(true);
    }
  }, []);

    const handleLogout = () => {
        // setUser(null);
        // setIsLoggedIn(false);
        localStorage.removeItem('token');
        alert('User logged out');
        router.push('/auth/singin');
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
        <h1 className="text-3xl font-bold text-brand-primary">Home page</h1>
        <h2 className="text-lg font-bold text-brand-primary">Work in progress…</h2>
        <br></br>
        {hasToken ? (
          <h1 className="text-2xl font-bold text-brand-primary">Masz token</h1>
        ) : (
          <h1 className="text-2xl font-bold text-brand-primary">No token found</h1>
        )}
        <button
            className="mybutton"
            onClick={(e) => handleLogout()}
        >
            Sign out
        </button>
    </div>
  );
};

export default HomePage;
