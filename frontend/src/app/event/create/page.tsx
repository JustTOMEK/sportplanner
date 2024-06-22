'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../../auth/component/withAuth';
function CreateEventPage({ onLogout }) {
    return (
        <div>
            <h1>Welcome to the CreateEventPage!</h1>
        </div>
    );
}

export default withAuth(CreateEventPage);