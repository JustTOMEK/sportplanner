import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SignIn({ providers }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
      <input
        type="text"
        placeholder="Username"
        className="mb-4 p-2 border border-brand-tertiary rounded-md w-80"
      />
      <input
        type="password"
        placeholder="Passwords"
        className="mb-4 p-2 border border-brand-tertiary rounded-md w-80"
      />
      <button className="mb-4 p-2 bg-brand-quaternary text-white rounded-md w-80">
        Login
      </button>
      <button
        onClick={() => router.push('/register')}
        className="mb-4 p-2 bg-brand-primary text-white rounded-md w-80"
      >
        Register if you are new
      </button>
      {providers && Object.values(providers).map((provider) => (
        <div key={provider.name} className="w-80">
          <button
            onClick={() => signIn(provider.id)}
            className="mb-4 p-2 bg-brand-tertiary text-brand-primary rounded-md w-full flex items-center justify-center"
          >
            {provider.name === 'Google' && (
              <img
                src="/images/google-logo.png"
                alt="Google logo"
                className="mr-2"
                style={{ width: '24px', height: '24px' }}
              />
            )}
            Continue with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
