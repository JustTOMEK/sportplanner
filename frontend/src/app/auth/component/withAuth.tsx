// app/hoc/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/signin');
            } else {
                setLoading(false);
            }
        }, [router]);

        if (loading) {
            return <p>Loading...</p>; // You can replace this with a loading spinner if you have one
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
