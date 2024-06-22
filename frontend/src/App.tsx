// pages/_app.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Możesz tutaj sprawdzić, czy użytkownik jest zalogowany na podstawie tokena JWT lub innej logiki
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            // Możesz też ustawić użytkownika na podstawie tokena lub dodatkowego zapytania do API
            setUser({ name: 'Sample User' }); // Przykład
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogin = (user: any) => {
        setUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('token', 'sample_token'); // Przykład ustawienia tokena
        router.push('/home');
    };

    const handleRegister = (user: any) => {
        setUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('token', 'sample_token'); // Przykład ustawienia tokena
        router.push('/home');
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        alert('User logged out');
        router.push('/welcome');
    };

    return (
        <Component
            {...pageProps}
            isLoggedIn={isLoggedIn}
            user={user}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
        />
    );
}

export default MyApp;
