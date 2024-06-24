'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "../../../Styles/EditEventPage.css";
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

const EditEventPage = () => {
    const [event, setEvent] = useState<Event | null>(null);
    const [sports, setSports] = useState<Sport[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [token, setToken] = useState<string | null>(null);
    const [participants, setParticipants] = useState<User[]>([]); // State for participants
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const fetchParticipants = async () => {
        const query = new URLSearchParams(window.location.search);
        const eventId = query.get('id');
        if (!eventId || !token) {
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

    useEffect(() => {
        const fetchEvent = async () => {
            const query = new URLSearchParams(window.location.search);
            const eventId = query.get('id');
            if (!eventId) {
                setErrors({ general: 'No event ID provided' });
                return;
            }

            setErrors({});
            if (!token) {
                setErrors({ general: 'No token found' });
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
                    setErrors({ general: 'Failed to fetch event' });
                }
            } catch (error) {
                console.error('Failed to fetch event', error);
                setErrors({ general: 'Failed to fetch event' });
            }
        };

        const fetchSports = async () => {
            if (!token) {
                setErrors({ general: 'No token found' });
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/sports/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: Sport[] = await response.json();
                    setSports(data);
                } else {
                    setErrors({ general: 'Failed to fetch sports' });
                }
            } catch (error) {
                console.error('Failed to fetch sports', error);
                setErrors({ general: 'Failed to fetch sports' });
            }
        };

        if (token) {
            fetchEvent();
            fetchSports();
            fetchParticipants();
        }
    }, [token]);

    const validateDates = (startDate: string, endDate: string): string | null => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (start >= end) {
            return 'Start date must be before end date';
        }

        if (start <= now) {
            return 'Start date must be in the future';
        }

        return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setEvent(prevState => {
            if (!prevState) return null;

            let updatedEvent = { ...prevState };

            if (name === 'sport') {
                const selectedSport = sports.find(sport => sport.id.toString() === value);
                if (selectedSport) {
                    updatedEvent = {
                        ...updatedEvent,
                        sport: {
                            id: selectedSport.id,
                            name: selectedSport.name,
                        },
                    };
                }
            } else if (name === 'start_date' || name === 'end_date') {
                const startDate = name === 'start_date' ? value : updatedEvent.start_date;
                const endDate = name === 'end_date' ? value : updatedEvent.end_date;
                const dateError = validateDates(startDate, endDate);
                if (dateError) {
                    setErrors({ ...errors, [name]: dateError });
                } else {
                    const { start_date, end_date, ...rest } = errors;
                    setErrors(rest);
                }
            } else {
                const { [name]: removed, ...rest } = errors;
                setErrors(rest);
            }

            return updatedEvent;
        });
    };

    const handleRemoveParticipant = async (participantId: number) => {
        if (!token || !event) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/events/removeParticipant`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ eventId: event.id, participantId }),
            });

            if (response.ok) {
                alert('Participant removed successfully!');
                fetchParticipants();
            } else {
                console.error('Failed to remove participant', response.statusText);
                alert('Failed to remove participant');
            }
        } catch (error) {
            console.error('Failed to remove participant', error);
            alert('Failed to remove participant');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!event) {
            setErrors({ general: 'No event data available' });
            return;
        }

        const dateError = validateDates(event.start_date, event.end_date);
        if (dateError) {
            setErrors({ ...errors, dateError });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/events/${event.id}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(event),
            });

            if (response.ok) {
                alert('Event successfully updated!');
                router.push(`/event/view?id=${event.id}`);
            } else {
                setErrors({ general: 'Failed to update event' });
            }
        } catch (error) {
            console.error('Failed to update event', error);
            setErrors({ general: 'Failed to update event' });
        }
    };

    const handleDiscardChanges = () => {
        router.back();
    };

    return (
        <div className="edit-event-container">
            <h1>Edit Event</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                {errors.general && <div className="error-message">{errors.general}</div>}
                <label>
                    Title:
                    <input type="text" name="title" value={event?.title || ''} onChange={handleInputChange} />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </label>
                <label>
                    Description:
                    <textarea name="description" value={event?.description || ''} onChange={handleInputChange}></textarea>
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </label>
                <label>
                    Sport:
                    <select name="sport" value={event?.sport.id.toString()} onChange={handleInputChange} required>
                        <option value="">Select Sport</option>
                        {sports.map(sport => (
                            <option key={sport.id} value={sport.id}>{sport.name}</option>
                        ))}
                    </select>
                    {errors.sport && <div className="error-message">{errors.sport}</div>}
                </label>
                <label>
                    Street:
                    <input type="text" name="address.street" value={event?.address.street || ''} onChange={handleInputChange} />
                    {errors['address.street'] && <div className="error-message">{errors['address.street']}</div>}
                </label>
                <label>
                    Building Number:
                    <input type="text" name="address.building_number" value={event?.address.building_number || ''} onChange={handleInputChange} />
                    {errors['address.building_number'] && <div className="error-message">{errors['address.building_number']}</div>}
                </label>
                <label>
                    Flat Number:
                    <input type="text" name="address.flat_number" value={event?.address.flat_number || ''} onChange={handleInputChange} />
                    {errors['address.flat_number'] && <div className="error-message">{errors['address.flat_number']}</div>}
                </label>
                <label>
                    Postal Code:
                    <input type="text" name="address.postal_code" value={event?.address.postal_code || ''} onChange={handleInputChange} />
                    {errors['address.postal_code'] && <div className="error-message">{errors['address.postal_code']}</div>}
                </label>
                <label>
                    City:
                    <input type="text" name="address.city" value={event?.address.city || ''} onChange={handleInputChange} />
                    {errors['address.city'] && <div className="error-message">{errors['address.city']}</div>}
                </label>
                <label>
                    Country:
                    <input type="text" name="address.country" value={event?.address.country || ''} onChange={handleInputChange} />
                    {errors['address.country'] && <div className="error-message">{errors['address.country']}</div>}
                </label>
                <label>
                    Latitude:
                    <input type="text" name="latitude" value={event?.latitude || ''} onChange={handleInputChange} />
                    {errors.latitude && <div className="error-message">{errors.latitude}</div>}
                </label>
                <label>
                    Longitude:
                    <input type="text" name="longitude" value={event?.longitude || ''} onChange={handleInputChange} />
                    {errors.longitude && <div className="error-message">{errors.longitude}</div>}
                </label>
                <label>
                    Start Date:
                    <input type="datetime-local" name="start_date" value={event ? new Date(event.start_date).toISOString().slice(0, -1) : ''} onChange={handleInputChange} />
                    {errors.start_date && <div className="error-message">{errors.start_date}</div>}
                </label>
                <label>
                    End Date:
                    <input type="datetime-local" name="end_date" value={event ? new Date(event.end_date).toISOString().slice(0, -1) : ''} onChange={handleInputChange} />
                    {errors.end_date && <div className="error-message">{errors.end_date}</div>}
                </label>
                <button
                    type="submit"
                    className="mybutton-blue !py-3"
                >
                    Save
                </button>
                <button
                    type="button"
                    className="mybutton-gray !py-3"
                    onClick={handleDiscardChanges}
                >
                    Discard Changes
                </button>
            </form>

            <div>
                {participants.length > 0 ? (
                    <div>
                        <h2>Participants:</h2>
                        <table>
                            <tbody>
                            {participants.map(participant => (
                                <tr key={participant.id}>
                                    <td>{participant.username}</td>
                                    <td>
                                        <button
                                            className="mybutton-blue my-1 ml-4"
                                            onClick={() => handleRemoveParticipant(participant.id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>No participants yet.</div>
                )}
            </div>
        </div>
    );
};

export default withAuth(EditEventPage);
