'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../Styles/HomePage.css";
import withAuth from '../auth/component/withAuth';
import default_profile_pic from "../../Images/default.png";

interface Event {
    id: number;
    title: string;
}

const HomePage = () => {
    const router = useRouter();
    const [participantEvents, setParticipantEvents] = useState<Event[]>([]);
    const [ownedEvents, setOwnedEvents] = useState<Event[]>([]);
    const [profilePicture, setProfilePicture] = useState<string>(default_profile_pic.src);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchParticipantEvents();
            fetchOwnedEvents();
            fetchProfilePicture();
        }
    }, [token]);

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

    const handleLogout = async () => {
        const response = await fetch('http://localhost:8080/api/auth/logout', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem('token');
            alert("User logged out");
            router.push('/auth/signin');
        } else {
            alert("Failed to logout");
        }
    };

    const fetchParticipantEvents = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/events/participating', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const eventsData = await response.json();
                setParticipantEvents(eventsData);
            } else {
                console.error('Failed to fetch participating events');
            }
        } catch (error) {
            console.error('Failed to fetch participating events', error);
        }
    };

    const fetchOwnedEvents = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/events/owned', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const eventsData = await response.json();
                setOwnedEvents(eventsData);
            } else {
                console.error('Failed to fetch owned events');
            }
        } catch (error) {
            console.error('Failed to fetch owned events', error);
        }
    };

    const handleMoreInfo = (eventId: number) => {
        router.push(`/event/view?id=${eventId}`);
    };

    const handleCreateEvent = () => {
        router.push('/event/create');
    };

    const handleMyAccount = () => {
        router.push(`/profile`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
            <h1>Home page</h1>
            <button
                className="mybutton-blue absolute top-3 right-3"
                onClick={() => handleLogout()}
            >
                Sign out
            </button>

            <button
                className="mybutton-blue absolute top-3 left-3"
                onClick={() => router.push('/search')}
            >
                Search events
            </button>

            <button
                className="mybutton-blue absolute top-3 right-30 !p-2.5"
                onClick={() => handleMyAccount()}
            >
                <div className="w-100 flex items-center justify-between gap-x-2.5">
                    <img
                        src={profilePicture}
                        alt="Profile picture"
                        className="w-[35px] h-[35px] rounded-full"
                    />
                    <span
                        className=""
                    >
                        My Account
                    </span>
                </div>
            </button>

            <button
                className="mybutton-blue absolute bottom-3 right-3"
                onClick={() => handleCreateEvent()}
            >
                Create event
            </button>

            <div className="events-container">
                <div className="events-header">
                    <h2>Events you are attending:</h2>
                    {participantEvents.length > 0 ? (
                        <div className="mylist-container">
                            {participantEvents.map(event => (
                                <div className="mylist-entry" key={event.id}>
                                    <span>
                                        {event.title}
                                    </span>
                                    <button
                                        onClick={() => handleMoreInfo(event.id)}
                                        className="mybutton-green"
                                    >
                                        More Info
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
                <div className="events-header">
                    <h2>Events you are hosting:</h2>
                    {ownedEvents.length > 0 ? (
                        <div className="mylist-container">
                            {ownedEvents.map(event => (
                                <div className="mylist-entry" key={event.id}>
                                    <span>
                                        {event.title}
                                    </span>
                                    <button
                                        onClick={() => handleMoreInfo(event.id)}
                                        className="mybutton-green"
                                    >
                                        More Info
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withAuth(HomePage);
