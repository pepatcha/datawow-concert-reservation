'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import StatsBar from '../../../components/StatsBar';
import { api } from '../../../lib/api';

export default function AdminCreate() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required');
    if (!totalSeats || Number(totalSeats) < 1) return setError('Total seats must be at least 1');
    if (!description.trim()) return setError('Description is required');

    setLoading(true);
    try {
      await api.createConcert({
        name: name.trim(),
        description: description.trim(),
        totalSeats: Number(totalSeats),
      });
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create concert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar role="admin" />
      <main className="layout__main">
        <StatsBar />

        <div className="page-header">
          <div className="page-header__tabs">
            <a href="/admin" className="page-header__tab">Overview</a>
            <span className="page-header__tab page-header__tab--active">Create</span>
          </div>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form__title">Create</h2>

          <div className="form__group">
            <label className="form__label" htmlFor="name">Concert Name</label>
            <input
              id="name"
              className="form__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Concert name"
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="seats">Total Seats</label>
            <input
              id="seats"
              className="form__input"
              type="number"
              min="1"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>

          <div className="form__actions">
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#999' : '#2d8a6e',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
