'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../Styles/HomePage.css";
import withAuth from '../auth/component/withAuth';

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
        router.push('/auth/signin');
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
        <h1 className="header">Home page</h1>
        {/*<h2 className="text-lg font-bold text-brand-primary">Work in progress…</h2>*/}
        {/*<br></br>*/}
        {/*{hasToken ? (*/}
        {/*  <h1 className="text-2xl font-bold text-brand-primary">Masz token</h1>*/}
        {/*) : (*/}
        {/*  <h1 className="text-2xl font-bold text-brand-primary">No token found</h1>*/}
        {/*)}*/}
        <button
            className="logout_button"
            onClick={(e) => handleLogout()}
        >
            Sign out
        </button>

        <button
            className="search_button"
            onClick={(e) => router.push('/search')}
        >Search events</button>

        <div className="events-container">
            <div className="events-header events-header_1">
                <h2>Events you are attending:</h2>
            </div>
            <div className="events-header events-header_2">
                <h2>Events you are hosting:</h2>
                <button
                    className="create_event_button"
                    onClick={() => router.push('/event/create')}
                >
                    Create event
                </button>
            </div>
        </div>



    </div>
  );
};

export default withAuth(HomePage);
