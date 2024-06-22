'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../Styles/HomePage.css";
import withAuth from '../auth/component/withAuth';

interface Event {
    id: number;
    title: string;
}

const HomePage = () => {
    const router = useRouter();
    const [participantEvents, setParticipantEvents] = useState<Event[]>([]);
    const [ownedEvents, setOwnedEvents] = useState<Event[]>([]);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setHasToken(true);
            fetchParticipantEvents(token);
            fetchOwnedEvents(token);
        }
    }, []);

    const handleLogout = () => {
        // setUser(null);
        // setIsLoggedIn(false);
        localStorage.removeItem('token');
        alert('User logged out');
        router.push('/auth/signin');
    };

    const fetchParticipantEvents = async (token: string) => {
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

    const fetchOwnedEvents = async (token: string) => {
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

    const handleMoreInfo1 = (eventId: number) => {
        router.push(`/event/view/participating?id=${eventId}`);
    };

    const handleMoreInfo2 = (eventId: number) => {
        router.push(`/event/view/hosting?id=${eventId}`);
    };

    const handleCreateEvent = () => {
        router.push('/event/create');
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
                                <div className="mylist-entry">
                                    <span>
                                        {event.title}
                                    </span>
                                    <button
                                        onClick={() => handleMoreInfo1(event.id)}
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
                            {participantEvents.map(event => (
                                <div className="mylist-entry">
                                    <span>
                                        {event.title}
                                    </span>
                                    <button
                                        onClick={() => handleMoreInfo2(event.id)}
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
