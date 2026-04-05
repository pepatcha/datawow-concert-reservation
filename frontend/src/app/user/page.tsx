'use client';

import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import ConcertCard from '../../components/ConcertCard';
import { api } from '../../lib/api';
import type { Concert, Reservation } from '../../types';

const MOCK_USER_ID = 2; // seeded user

export default function UserHome() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [concertsData, reservationsData] = await Promise.all([
        api.getConcerts(),
        api.getUserReservations(MOCK_USER_ID),
      ]);
      setConcerts(concertsData);
      setReservations(reservationsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReserve = async (concertId: number) => {
    setError('');
    setLoadingId(concertId);
    try {
      await api.reserve({ concertId, userId: MOCK_USER_ID });
      setSuccess('Reservation successful!');
      await loadData();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reserve');
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (reservationId: number) => {
    setError('');
    setLoadingId(reservationId);
    try {
      await api.cancelReservation(reservationId);
      setSuccess('Reservation cancelled');
      await loadData();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cancel');
    } finally {
      setLoadingId(null);
    }
  };

  const getReservationId = (concertId: number): number | null => {
    const r = reservations.find((res) => res.concert.id === concertId);
    return r ? r.id : null;
  };

  return (
    <div className="layout">
      <Sidebar role="user" />
      <main className="layout__main">
        <h2 className="page-header__title" style={{ marginBottom: '1.5rem' }}>
          Concerts
        </h2>

        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        {concerts.map((concert) => (
          <ConcertCard
            key={concert.id}
            concert={concert}
            variant="user"
            userReservationId={getReservationId(concert.id)}
            onReserve={handleReserve}
            onCancel={handleCancel}
            loading={loadingId != null}
          />
        ))}

        {concerts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
            No concerts available
          </p>
        )}
      </main>
    </div>
  );
}
