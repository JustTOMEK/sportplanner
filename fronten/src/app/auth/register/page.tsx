'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        password,
      });

      if (response.status === 200) {
        // Handle successful registration
        console.log('Registration successful', response.data);
        // Redirect to the sign-in page after registration
        router.push('/auth/signin');
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
