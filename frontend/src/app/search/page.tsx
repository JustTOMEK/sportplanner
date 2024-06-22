'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "../../Styles/SearchPage.css";

interface Sport {
    id: number;
    name: string;
}

interface Address {
    id: number;
    city: string;
}

interface Event {
    id: number;
    title: string;
    description: string;
    address: Address;
}

const SearchPage = () => {
    const [sportsCategories, setSportsCategories] = useState<Sport[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [city, setCity] = useState<string | null>(null);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();

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

    // Załadowanie na początek listy wszystkich wydarzeń (wyszukiwanie z pustymi kryteriami)
    useEffect(() => {
        filterEvents();
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
                    sportIds: selectedCategories.length > 0 ? selectedCategories : null,
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

    const handleEventClick = (eventId: number) => {
        // router.push(`/event/view/${eventId}`);
        router.push(`/event/view`);
    };

    return (
        <div className="search-page-container">
            <div className="search-panel">
                <h1>SearchPage</h1>
                <input
                    type="text"
                    placeholder="Search cities"
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
                    <tbody>
                    {filteredEvents.map((event) => (
                        <tr key={event.id}  className="event-row">
                            <td>{event.title}</td>
                            <td>
                                <button
                                    key={event.id}
                                    onClick={() => handleEventClick(event.id)}
                                    className="event-info-button"
                                >More info</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SearchPage;
