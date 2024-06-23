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
        }
    }, [token]);

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
            <h1 className="header">Home page</h1>
            <button
                className="logout_button"
                onClick={() => handleLogout()}
            >
                Sign out
            </button>

            <button
                className="search_button"
                onClick={() => router.push('/search')}
            >
                Search events
            </button>

            <div className="events-container">
                <div className="events-header events-header_1">
                    <h2>Events you are attending:</h2>
                    {participantEvents.length > 0 ? (
                        <table className="events-table">
                            <tbody>
                            {participantEvents.map(event => (
                                <tr key={event.id}>
                                    <td>{event.title}</td>
                                    <td>
                                        <button onClick={() => handleMoreInfo(event.id)} className="more-info-button">More Info</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
                <div className="events-header events-header_2">
                    <h2>Events you are hosting:</h2>
                    {ownedEvents.length > 0 ? (
                        <ul className="owned-events-list">
                            {ownedEvents.map(event => (
                                <li key={event.id}>
                                    {event.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No events found.</p>
                    )}
                    <button
                        className="create_event_button"
                        onClick={() => handleCreateEvent()}
                    >
                        Create event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withAuth(HomePage);
