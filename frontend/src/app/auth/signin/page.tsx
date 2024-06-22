'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../component/withAuth';

export default function SignIn() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store the JWT token or handle successful login
                localStorage.setItem('token', data.token);
                console.log('Login successful', data);
                // Redirect to the home page after login
                router.push('/home');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
            <form onSubmit={handleLogin} className="flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="myinput mb-2 w-80"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="myinput mb-4 w-80"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="mybutton-blue mb-4 w-80"
                >
                    Login
                </button>
            </form>
            <button
                onClick={() => router.push('/auth/register')}
                className="mybutton-orange mb-4 w-80"
            >
                Register if you are new
            </button>
        </div>
    );
}
