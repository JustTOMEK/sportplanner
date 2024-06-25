'use client';

import { useRouter } from 'next/navigation';
import withAuth from '../auth/component/withAuth';

function WelcomePage({ onLogout }) {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/auth/signin');
    };

    const handleRegisterClick = () => {
        router.push('/auth/register');
    };

    return (
        <div className="flex h-screen bg-blue-50 text-blue-900">
            <div className="w-1/2 p-8 bg-blue-100 flex flex-col justify-center items-center">
                <div className="space-y-6">
                    <div className="bg-blue-200 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl mb-2 text-blue-700">Create an Event</h3>
                        <p className="text-base text-blue-600">Organize your own sports event and invite others to join.</p>
                    </div>
                    <div className="bg-blue-200 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl mb-2 text-blue-700">Join an Event</h3>
                        <p className="text-base text-blue-600">Browse and join events hosted by others.</p>
                    </div>
                    <div className="bg-blue-200 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl mb-2 text-blue-700">Meet New People</h3>
                        <p className="text-base text-blue-600">Connect with individuals who share your interests and hobbies globally.</p>
                    </div>
                </div>
            </div>
            <div className="w-1/2 p-8 flex flex-col justify-center items-center">
                <h1 className="text-4xl mb-6 text-blue-800">Welcome to SportsTogether!</h1>
                <p className="text-lg mb-10 text-center">
                    Discover and join events, meet new people, and connect with others who share your passion for sports and hobbies from around the world.
                </p>
                <div className="flex space-x-4">
                    <button
                        className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                    <button
                        className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
                        onClick={handleRegisterClick}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
