'use client';

import { useState, useEffect } from 'react';
import "../../Styles/SearchPage.css";

interface Event {
    id: number;
    name: string;
    city: string;
}

interface Sport {
    id: number;
    name: string;
}

const SearchPage = () => {
    const [sportsCategories, setSportsCategories] = useState<Sport[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [city, setCity] = useState('');
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Pobieranie kategorii sportowych z backendu
    useEffect(() => {
        const fetchCategories = async () => {
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
                    setSportsCategories(data);
                } else {
                    setError('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Failed to fetch categories', error);
                setError('Failed to fetch categories');
            }
        };

        fetchCategories();
    }, [token]);

    // Pobieranie wydarzeń z backendu
    useEffect(() => {
        const fetchEvents = async () => {
            setError(null);
            if (!token) {
                setError('No token found');
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/events', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                    setFilteredEvents(data);
                } else {
                    setError('Failed to fetch events');
                }
            } catch (error) {
                console.error('Failed to fetch events', error);
                setError('Failed to fetch events');
            }
        };

        fetchEvents();
    }, [token]);

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(categoryId)
                ? prevSelectedCategories.filter((id) => id !== categoryId)
                : [...prevSelectedCategories, categoryId]
        );
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const filterEvents = async () => {
        setError(null);
        if (!token) {
            setError('No token found');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/events/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    city: city,
                    sportId: selectedCategories.length > 0 ? selectedCategories[0] : null, // Assuming only one sport category for simplicity
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setFilteredEvents(data);
            } else {
                setError('Failed to fetch filtered events');
            }
        } catch (error) {
            console.error('Failed to fetch filtered events', error);
            setError('Failed to fetch filtered events');
        }
    };

    return (
        <div className="search-page-container">
            <div className="search-panel">
                <h1>SearchPage</h1>
                <input
                    type="text"
                    placeholder="Search cities"
                    value={city}
                    onChange={handleCityChange}
                    className="search-input"
                />
                <h2>Categories</h2>
                <div className="categories-list">
                    {sportsCategories.map((category) => (
                        <div key={category.id} className="category-item">
                            <input
                                type="checkbox"
                                id={category.name}
                                value={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                            />
                            <label htmlFor={category.name}>{category.name}</label>
                        </div>
                    ))}
                </div>
                {error && <p className="error-message">{error}</p>}
                <button onClick={filterEvents} className="filter-button">Filter</button>
            </div>
            <div className="events-list">
                <h2>Lista wydarzeń</h2>
                <table className="events-table">
                    <thead>
                    <tr>
                        <th>Event</th>
                        <th>City</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredEvents.map((event) => (
                        <tr key={event.id}>
                            <td>{event.name}</td>
                            <td>{event.city}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SearchPage;
