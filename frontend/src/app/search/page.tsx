'use client';

import { useState } from 'react';
import "../../Styles/SearchPage.css";

const sportsCategories = ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Running'];

const mockEvents = [
    { id: 1, name: 'Football Match', city: 'Warsaw' },
    { id: 2, name: 'Basketball Game', city: 'Krakow' },
    { id: 3, name: 'Tennis Tournament', city: 'Gdansk' },
    // Add more mock events as needed
];

function SearchPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [city, setCity] = useState('');
    const [filteredEvents, setFilteredEvents] = useState(mockEvents);

    // get all unique categories from backend
    const getCategories = async (event: React.FormEvent<HTMLFormElement>) => {
        // fetch categories
        try {
            const response = await fetch('http://localhost:8080/api/sport/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(category)
                ? prevSelectedCategories.filter((c) => c !== category)
                : [...prevSelectedCategories, category]
        );
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const filterEvents = () => {
        setFilteredEvents(
            mockEvents.filter(
                (event) =>
                    (city === '' || event.city.toLowerCase().includes(city.toLowerCase())) &&
                    (selectedCategories.length === 0 || selectedCategories.includes(event.name.split(' ')[0]))
            )
        );
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
                        <div key={category} className="category-item">
                            <input
                                type="checkbox"
                                id={category}
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <label htmlFor={category}>{category}</label>
                        </div>
                    ))}
                </div>
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
