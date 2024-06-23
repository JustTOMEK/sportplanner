'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);

    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasMinLength = password.length >= 5;
        const hasMaxLength = password.length <= 20;

        if (!hasUpperCase) {
            setPasswordError('Password must contain at least one uppercase letter.');
            return false;
        } else if (!hasNumber) {
            setPasswordError('Password must contain at least one number.');
            return false;
        } else if (!hasMinLength) {
            setPasswordError('Password must be at least 5 characters long.');
            return false;
        } else if (!hasMaxLength) {
            setPasswordError('Password must be at most 20 characters long.');
            return false;
        } else if (password.includes(' ')) {
            setPasswordError('Password cannot contain spaces.');
            return false;
        }
        setPasswordError(null);
        return true;
    };

    const validateUsername = (username: string) => {
        const hasMaxLength = username.length <= 20;

        if (!hasMaxLength) {
            setUsernameError('Username must be at most 20 characters long.');
            return false;
        }
        setUsernameError(null);
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const isUsernameValid = validateUsername(username);
        const isPasswordValid = validatePassword(password);

        if (!isUsernameValid || !isPasswordValid) {
            return;
        }

        try {
            const registerResponse = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (registerResponse.ok) {
                // Registration successful, now authenticate
                const loginResponse = await fetch('http://localhost:8080/api/auth/authenticate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (loginResponse.ok) {
                    const data = await loginResponse.json();
                    // Store the JWT token
                    localStorage.setItem('token', data.token);
                    console.log('Login successful', data);
                    // Redirect to the home page after login
                    router.push('/home');
                } else {
                    setError('Authentication failed after registration.');
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
            <h2 className="text-3xl mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="myinput mb-2 w-80"
                    maxLength={20}
                />
                {usernameError && <p className="text-red-500 mb-2">{usernameError}</p>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="myinput mb-2 w-80"
                />
                {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
                <button
                    type="submit"
                    className="mybutton-blue mb-4 w-80"
                >
                    Register
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            <button
                onClick={() => router.push('/auth/signin')}
                className="mybutton-orange mb-4 w-80"
            >
                Already have an account? Sign In
            </button>
        </div>
    );
}
