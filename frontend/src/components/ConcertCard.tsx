'use client';

import type { Concert } from '../types';

interface ConcertCardProps {
  concert: Concert;
  variant: 'admin' | 'user';
  userReservationId?: number | null;
  onDelete?: (id: number) => void;
  onReserve?: (concertId: number) => void;
  onCancel?: (reservationId: number) => void;
  loading?: boolean;
}

const dangerStyle: React.CSSProperties = {
  backgroundColor: '#dc3545',
  color: 'white',
  padding: '0.5rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const primaryStyle: React.CSSProperties = {
  backgroundColor: '#2d8a6e',
  color: 'white',
  padding: '0.5rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const disabledStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

export default function ConcertCard({
  concert,
  variant,
  userReservationId,
  onDelete,
  onReserve,
  onCancel,
  loading = false,
}: ConcertCardProps) {
  const availableSeats = concert.totalSeats - concert.reservedSeats;
  const isFull = availableSeats <= 0;
  const hasReserved = userReservationId != null;

  return (
    <div className="concert-card">
      <h3 className="concert-card__name">{concert.name}</h3>
      <p className="concert-card__description">{concert.description}</p>
      <div className="concert-card__footer">
        <span className="concert-card__seats">
          🪑 {availableSeats} / {concert.totalSeats}
        </span>

        {variant === 'admin' && onDelete && (
          <button style={dangerStyle} onClick={() => onDelete(concert.id)}>
            Delete
          </button>
        )}

        {variant === 'user' && hasReserved && onCancel && (
          <button
            style={{ ...dangerStyle, ...(loading ? disabledStyle : {}) }}
            onClick={() => onCancel(userReservationId)}
            disabled={loading}
          >
            {loading ? 'Cancelling...' : 'Cancel'}
          </button>
        )}

        {variant === 'user' && !hasReserved && onReserve && (
          <button
            style={{ ...primaryStyle, ...(isFull || loading ? disabledStyle : {}) }}
            onClick={() => onReserve(concert.id)}
            disabled={isFull || loading}
          >
            {isFull ? 'Full' : loading ? 'Reserving...' : 'Reserve'}
          </button>
        )}
      </div>
    </div>
  );
}
