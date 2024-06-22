'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../auth/component/withAuth';


function WelcomePage({ onLogout }) {
    return (
        <div>
            <h1>Welcome to the WelcomePage!</h1>
        </div>
    );
}

export default withAuth(WelcomePage);