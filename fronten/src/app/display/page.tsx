'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Sport {
  id: number;
  name: string;
}

const SportsPage = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/sports/all');
        setSports(response.data);
      } catch (error) {
        setError('Failed to fetch sports');
      }
    };

    fetchSports();
  }, []);

  return (
    <div>
      <h1>Sports</h1>
      {error && <p>{error}</p>}
      <ul>
        {sports.map((sport) => (
          <li key={sport.id}>{sport.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SportsPage;