const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(
      Array.isArray(error.message) ? error.message.join(', ') : error.message,
    );
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json();
}

export const api = {
  // Concerts
  getConcerts: () => request<import('../types').Concert[]>('/concerts'),
  createConcert: (data: { name: string; description: string; totalSeats: number }) =>
    request<import('../types').Concert>('/concerts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteConcert: (id: number) =>
    request<void>(`/concerts/${id}`, { method: 'DELETE' }),
  getStats: () => request<import('../types').Stats>('/concerts/stats'),

  // Reservations
  reserve: (data: { concertId: number; userId: number }) =>
    request<import('../types').Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancelReservation: (id: number) =>
    request<void>(`/reservations/${id}`, { method: 'DELETE' }),
  getUserReservations: (userId: number) =>
    request<import('../types').Reservation[]>(`/reservations/user/${userId}`),

  // Reservation Logs
  getAllLogs: () => request<import('../types').ReservationLog[]>('/reservation-logs'),
  getUserLogs: (userId: number) =>
    request<import('../types').ReservationLog[]>(`/reservation-logs/user/${userId}`),
};
