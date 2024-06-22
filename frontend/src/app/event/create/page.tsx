'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import  "../../../Styles/EventCreatePage.css";

function CreateEventPage({ onLogout }) {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sportId, setSportId] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [buildingNumber, setBuildingNumber] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState<string | null>(null); // Specify the type of error state

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return;
        }

        const eventDto = {
            title,
            description,
            sportId,
            country,
            city,
            street,
            building_number: buildingNumber,
            flat_number: flatNumber,
            postal_code: postalCode,
            latitude,
            longitude,
        };

        try {
            const response = await fetch('http://localhost:8080/api/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(eventDto),
            });

            if (response.ok) {
                const eventData = await response.json();
                // router.push(`/event/view?id=${eventData.id}`);
                router.push('/home');
            } else {
                setError('Failed to create event');
            }
        } catch (error) {
            console.error('Failed to create event', error);
            setError('Failed to create event');
        }
    };

    return (
        <div>
            <h1>Welcome to the CreateEventPage!</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <br />
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
                <br />
                <label>
                    Sport ID:
                    <input type="number" value={sportId} onChange={(e) => setSportId(e.target.value)} required />
                </label>
                <br />
                <label>
                    Country:
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </label>
                <br />
                <label>
                    City:
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                </label>
                <br />
                <label>
                    Street:
                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
                </label>
                <br />
                <label>
                    Building Number:
                    <input type="text" value={buildingNumber} onChange={(e) => setBuildingNumber(e.target.value)} />
                </label>
                <br />
                <label>
                    Flat Number:
                    <input type="text" value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} />
                </label>
                <br />
                <label>
                    Postal Code:
                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                </label>
                <br />
                <label>
                    Latitude:
                    <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                </label>
                <br />
                <label>
                    Longitude:
                    <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
}

export default CreateEventPage;