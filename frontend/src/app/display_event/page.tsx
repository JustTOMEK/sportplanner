
'use client';

import React, { useEffect, useState } from 'react';

interface Event {
  id: number;
  title: string;
  description: string;
  sportId: number;
  country: string;
  city: string;
  street: string;
  building_number: number;
  flat_number: number;
  postal_code: string;
  latitude: number;
  longitude: number;
}

const DisplayEventPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>All Events</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem', paddingBottom: '1rem' }}>
            <h2>{event.title}</h2>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Sport ID:</strong> {event.sportId}</p>
            <p><strong>Country:</strong> {event.country}</p>
            <p><strong>City:</strong> {event.city}</p>
            <p><strong>Street:</strong> {event.street}</p>
            <p><strong>Building Number:</strong> {event.building_number}</p>
            <p><strong>Flat Number:</strong> {event.flat_number}</p>
            <p><strong>Postal Code:</strong> {event.postal_code}</p>
            <p><strong>Latitude:</strong> {event.latitude}</p>
            <p><strong>Longitude:</strong> {event.longitude}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayEventPage;
