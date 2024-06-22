'use client';

import { useState, useEffect } from 'react';
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
    const [cities, setCities] = useState<Address[]>([]);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
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

    // Załadowanie na początek listy wszystkich wydarzeń (wyszukiwanie z pustymi kryteriami)
    useEffect(() => {
        filterEvents();
    }, [token]);


    // Pobieranie miast z backendu
    const fetchCities = async () => {
        setError(null);
        if (!token) {
            setError('No token found');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/addresses/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCities(data);
            } else {
                setError('Failed to fetch cities');
            }
        } catch (error) {
            console.error('Failed to fetch cities', error);
            setError('Failed to fetch cities');
        }
    };

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

    const handleCitySelect = (city: string) => {
        setCity(city);
        setShowCityDropdown(false);
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
                    value={city || ""}
                    onChange={handleCityChange}
                    onFocus={fetchCities}
                    onClick={() => setShowCityDropdown(true)}
                    className="search-input"
                />
                {showCityDropdown && (
                    <div className="city-dropdown">
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                className="city-item"
                                onClick={() => handleCitySelect(city.city)}
                            >
                                {city.city}
                            </div>
                        ))}
                    </div>
                )}
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
                            <td>{event.title}</td>
                            <td>{event.address.city}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SearchPage;
