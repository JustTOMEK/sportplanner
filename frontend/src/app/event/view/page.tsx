'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../../auth/component/withAuth';

function EventPage({ onLogout }) {
    return (
        <div>
            <h1>Welcome to the EventPage!</h1>
        </div>
    );
}

export default withAuth(EventPage);