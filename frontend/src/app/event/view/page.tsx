// ViewEventPage Component

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "../../../Styles/ViewEventPage.css";
import withAuth from '../../auth/component/withAuth';

interface User {
    id: number;
    username: string;
    email: string | null;
    role: string;
}

interface Sport {
    id: number;
    name: string;
}

interface Address {
    id: number;
    country: string;
    city: string;
    street: string;
    building_number: string;
    flat_number: string | null;
    postal_code: string;
}

interface Event {
    id: number;
    title: string;
    description: string;
    owner: User;
    sport: Sport;
    address: Address;
    latitude: number;
    longitude: number;
    modification_date: string;
    start_date: string;
    end_date: string;
}

const ViewEventPage = () => {
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [participants, setParticipants] = useState<User[]>([]);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const router = useRouter();
    const [mapUrl, setMapUrl] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            const query = new URLSearchParams(window.location.search);
            const eventId = query.get('id');
            if (!eventId) {
                setError('No event ID provided');
                return;
            }

            setError(null);
            if (!token) {
                setError('No token found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: Event = await response.json();
                    setEvent(data);
                } else {
                    setError('Failed to fetch event');
                }
            } catch (error) {
                console.error('Failed to fetch event', error);
                setError('Failed to fetch event');
            }
        };

        const fetchRole = async () => {
            const query = new URLSearchParams(window.location.search);
            const eventId = query.get('id');
            if (!eventId) {
                return;
            }

            if (!token) {
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/events/${eventId}/role`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setRole(await response.text());
                } else {
                    console.error('Failed to fetch role', response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch role', error);
            }
        };

        if (token) {
            fetchEvent();
            fetchRole();
        }
    }, [token]);

    useEffect(() => {
        if (event && event.latitude && event.longitude) {
            const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDSu9lCeABtITI1suM98VZl2jabENT7vVc&q=${event.latitude},${event.longitude}&zoom=15`;
            setMapUrl(url);
            console.log('Map URL set:', url);
        }
    }, [event]);

    useEffect(() => {
        const fetchParticipants = async () => {
            const query = new URLSearchParams(window.location.search);
            const eventId = query.get('id');
            if (!eventId) {
                return;
            }

            if (!token) {
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/events/${eventId}/participants`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: User[] = await response.json();
                    setParticipants(data);
                } else {
                    console.error('Failed to fetch participants', response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch participants', error);
            }
        };

        if (role === "owner") {
            fetchParticipants();
        }
    }, [role]);

    const leaveEvent = async () => {
        if (!event) {
            setError('No event data available');
            return;
        }

        setIsLeaving(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/events/leave', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ eventId: event.id }),
            });

            if (response.ok) {
                alert('Successfully left the event!');
                router.push('/home');
            } else {
                setError('Failed to leave event');
            }
        } catch (error) {
            console.error('Failed to leave event', error);
            setError('Failed to leave event');
        } finally {
            setIsLeaving(false);
        }
    };

    const deleteEvent = async () => {
        if (!event) {
            setError('No event data available');
            return;
        }

        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/events/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(event.id),
            });

            if (response.ok) {
                alert('Event successfully deleted!');
                router.push('/home');
            } else {
                setError('Failed to delete event');
            }
        } catch (error) {
            console.error('Failed to delete event', error);
            setError('Failed to delete event');
        }
    };

    const joinEvent = async () => {
        if (!event) {
            setError('No event data available');
            return;
        }

        setIsJoining(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/events/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ eventId: event.id }),
            });

            if (response.ok) {
                // You may handle success message or redirect here
                alert('Successfully joined the event!');
                router.push('/home');
            } else {
                setError('Failed to join event');
            }
        } catch (error) {
            console.error('Failed to join event', error);
            setError('Failed to join event');
        } finally {
            setIsJoining(false);
        }
    };

    const editEvent = () => {
        if (event) {
            router.push(`/event/edit?id=${event.id}`);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!event) {
        return <div className="loading-message">Loading...</div>;
    }

    return (
        <div className="event-view-container">
            <h1>{event.title}</h1>
            <p>{event.description}</p>

            <div className="event-details mb-2">
                <h2>Details</h2>
                <p><strong>Sport:</strong> {event.sport.name}</p>
                <p><strong>Organizer:</strong> {event.owner.username}</p>
                <p><strong>Location:</strong> {event.address.street} {event.address.building_number}, {event.address.postal_code} {event.address.city}, {event.address.country}</p>
                {event.latitude && event.longitude &&
                    <p><strong>Coordinates:</strong> {event.latitude}, {event.longitude}</p>
                }
                <p><strong>Start Date:</strong> {new Date(event.start_date).toLocaleString()}</p>
                <p><strong>End Date:</strong> {new Date(event.end_date).toLocaleString()}</p>
                <p><strong>Last Modified:</strong> {new Date(event.modification_date).toLocaleString()}</p>
            </div>

            {mapUrl && (
                <div className="w-100 h-[400px] mb-2 rounded">
                    <iframe
                        className="w-100 h-100 rounded"
                        allowFullScreen
                        src={mapUrl}
                    ></iframe>
                </div>
            )}

            {role === "owner" &&
                <div className="participants-section">
                    <h2>Participants</h2>
                    {participants.length > 0 ? (
                        <ul>
                            {participants.map((participant) => (
                                <li key={participant.id}>{participant.username}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No participants yet.</p>
                    )}
                </div>
            }

            <div className="action-buttons">
                {role === "owner" &&
                    <button
                        onClick={editEvent}
                        className="mybutton-blue w-100 !py-3 mt-4"
                    >
                        Edit Event
                    </button>
                }

                {role === "owner" ?
                    <button
                        onClick={deleteEvent}
                        className="mybutton-blue w-100 !py-3 mt-4"
                    >
                        Delete Event
                    </button>
                    : (role === "participant" ?
                            <button
                                onClick={leaveEvent}
                                className="mybutton-blue w-100 !py-3 mt-4"
                                disabled={isLeaving}
                            >
                                {isLeaving ? 'Leaving...' : 'Leave Event'}
                            </button>
                            :
                            <button
                                onClick={joinEvent}
                                className="mybutton-blue w-100 !py-3 mt-4"
                                disabled={isJoining}
                            >
                                {isJoining ? 'Joining...' : 'Join Event'}
                            </button>
                    )}
            </div>
        </div>
    );
}

export default withAuth(ViewEventPage);
