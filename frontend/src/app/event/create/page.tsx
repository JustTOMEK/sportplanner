'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../../Styles/EventCreatePage.css";

interface Sport {
    id: number;
    name: string;
}

function CreateEventPage({ onLogout }) {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sportName, setSportName] = useState('');
    const [sports, setSports] = useState<Sport[]>([]);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [buildingNumber, setBuildingNumber] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null); // New state for date-specific errors

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const fetchSports = async () => {
            setError(null);
            if (!token) {
                setError('No token found');
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
                    const data = await response.json();
                    setSports(data);
                } else {
                    setError('Failed to fetch sports');
                }
            } catch (error) {
                console.error('Failed to fetch sports', error);
                setError('Failed to fetch sports');
            }
        };

        fetchSports();
    }, [token]);

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        const currentDate = new Date().toISOString().slice(0, 16); // Get current date and time, truncate seconds and milliseconds

        if (new Date(newStartDate) <= new Date(currentDate)) {
            setDateError('Start date must be after the current date and time');
        } else if (new Date(newStartDate) >= new Date(endDate)) {
            setDateError('Start date must be before end date');
        } else {
            setDateError(null);
        }
        setStartDate(newStartDate);
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        if (new Date(startDate) >= new Date(newEndDate)) {
            setDateError('End date must be after start date');
        } else {
            setDateError(null);
        }
        setEndDate(newEndDate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError('No token found');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setDateError('End date must be after start date');
            return;
        }

        const selectedSport = sports.find(sport => sport.name === sportName);
        if (!selectedSport) {
            setError('Invalid sport selected');
            return;
        }

        const eventDto = {
            title,
            description,
            sportId: selectedSport.id,
            country,
            city,
            street,
            building_number: buildingNumber,
            flat_number: flatNumber,
            postal_code: postalCode,
            latitude,
            longitude,
            start_date: startDate,
            end_date: endDate,
            modification_date: new Date().toISOString(), // Set the current date and time
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
                    Sport:
                    <select value={sportName} onChange={(e) => setSportName(e.target.value)} required>
                        <option value="">Select a sport</option>
                        {sports.map((sport: Sport) => (
                            <option key={sport.id} value={sport.name}>{sport.name}</option>
                        ))}
                    </select>
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
                <label>
                    Start Date:
                    <input type="datetime-local" value={startDate} onChange={handleStartDateChange} required />
                    {dateError && <div className="error-message">{dateError}</div>}
                </label>
                <br />
                <label>
                    End Date:
                    <input type="datetime-local" value={endDate} onChange={handleEndDateChange} required />
                    {dateError && <div className="error-message">{dateError}</div>}
                </label>
                <br />
                <button type="submit" disabled={error !== null}>Add Event</button>
            </form>
        </div>
    );
}

export default CreateEventPage;
