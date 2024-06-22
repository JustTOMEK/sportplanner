'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "../../../../Styles/ViewEventPage.css";
import withAuth from '../../../auth/component/withAuth';

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
}

const ViewParticipatingEventPage = () => {
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);
    const router = useRouter();

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

        if (token) {
            fetchEvent();
        }
    }, [token]);

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
            <div className="event-details">
                <h2>Details</h2>
                <p><strong>Sport:</strong> {event.sport.name}</p>
                <p><strong>Organizer:</strong> {event.owner.username}</p>
                <p><strong>Location:</strong> {event.address.street}, {event.address.city}, {event.address.postal_code}, {event.address.country}</p>
                <p><strong>Coordinates:</strong> {event.latitude}, {event.longitude}</p>
            </div>
            <button
                onClick={leaveEvent}
                className="mybutton-blue w-100 !py-3 mt-4"
                disabled={isLeaving}
            >
                {isLeaving ? 'Leaving...' : 'Leave Event'}
            </button>
        </div>
    );
}

export default withAuth(ViewParticipatingEventPage);
