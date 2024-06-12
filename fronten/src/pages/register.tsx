import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement registration logic here
    console.log('Register with', { email, password });
    // After registration, redirect to sign-in page
    router.push('/auth/signin');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
      <button
        onClick={() => router.push('/auth/signin')}
        className="p-2 bg-brand-tertiary text-brand-primary rounded-md w-80"
      >
        Already have an account? Sign In
      </button>
    </div>
  );
}
