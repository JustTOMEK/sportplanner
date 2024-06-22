'use client';

import { useRouter } from 'next/navigation';
import withAuth from '../auth/component/withAuth';
import '../../Styles/WelcomePage.css';

function WelcomePage({ onLogout }) {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/auth/signin');
    };

    return (
        <div className="welcome-page">
            <h1>Welcome to the WelcomePage!</h1>
            <p>This is a sample welcome page for our application. Here you can find some basic information about our services and features.</p>
            <button onClick={handleLoginClick}>Login</button>
        </div>
    );
}

export default withAuth(WelcomePage);
