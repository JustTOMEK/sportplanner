'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import "../../Styles/ProfilePage.css";
import default_profile_pic from "../../Images/default.png";

interface User {
    id: number;
    username: string;
    email: string | null;
    role: string;
}

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<string>(default_profile_pic.src); // Set default image initially
    const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUser();
            fetchProfilePicture();
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const fetchProfilePicture = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users/get-profile-picture', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setProfilePicture(imageObjectURL);
            } else if (response.status === 404) {
                setProfilePicture(default_profile_pic.src); // Set to default image on 404
            } else {
                console.error('Failed to fetch profile picture');
            }
        } catch (error) {
            console.error('Failed to fetch profile picture', error);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadProfilePicture(file);
        }
    };

    const uploadProfilePicture = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:8080/api/users/upload-profile-picture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Profile picture uploaded successfully');
                fetchProfilePicture(); // Update profile picture after successful upload
            } else {
                console.error('Failed to upload profile picture');
            }
        } catch (error) {
            console.error('Failed to upload profile picture', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
            <h1>Profile</h1>
            <div>
                <img src={profilePicture} alt="Profile Picture" className="profile-picture" />
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
            </div>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    ref={(input) => setFileInput(input)}
                    style={{ display: 'none' }}
                />
                <button
                    className="mybutton-blue mt-4"
                    onClick={() => fileInput?.click()} // Open file input dialog
                >
                    Upload Profile Picture
                </button>
            </div>
            <button
                className="mybutton-blue mt-4"
                onClick={() => router.push('/home')}
            >
                Back
            </button>
        </div>
    );
};

export default Profile;
