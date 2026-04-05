'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Stats } from '../types';

interface StatsBarProps {
  refreshKey?: number;
}

export default function StatsBar({ refreshKey = 0 }: StatsBarProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getStats().then(setStats).catch((err) => setError(err.message));
  }, [refreshKey]);

  if (error) {
    return <div className="alert alert--error">Failed to load stats: {error}</div>;
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total of seats', value: stats.totalSeats, className: 'stats-card--green' },
    { label: 'Reserve', value: stats.totalReserved, className: 'stats-card--teal' },
    { label: 'Cancel', value: stats.totalCancelled, className: 'stats-card--red' },
  ];

  return (
    <div className="stats-bar">
      {cards.map((card) => (
        <div key={card.label} className={`stats-card ${card.className}`}>
          <span className="stats-card__label">{card.label}</span>
          <span className="stats-card__value">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
