'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

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
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="mb-4 p-2 border border-brand-tertiary rounded-md w-80"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="mb-4 p-2 border border-brand-tertiary rounded-md w-80"
        />
        <button type="submit" className="mb-4 p-2 bg-brand-primary text-white rounded-md w-80">
          Register
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={() => router.push('/auth/signin')}
        className="p-2 bg-brand-tertiary text-brand-primary rounded-md w-80"
      >
        Already have an account? Sign In
      </button>
    </div>
  );
}
