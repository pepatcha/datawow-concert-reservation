'use client';

import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import StatsBar from '../../components/StatsBar';
import ConcertCard from '../../components/ConcertCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import { api } from '../../lib/api';
import type { Concert } from '../../types';

export default function AdminHome() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Concert | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const loadConcerts = useCallback(() => {
    api.getConcerts().then(setConcerts).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    loadConcerts();
  }, [loadConcerts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteConcert(deleteTarget.id);
      setSuccess(`"${deleteTarget.name}" has been deleted`);
      setDeleteTarget(null);
      loadConcerts();
      setRefreshKey((k) => k + 1);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar role="admin" />
      <main className="layout__main">
        <StatsBar refreshKey={refreshKey} />

        <div className="page-header">
          <div className="page-header__tabs">
            <span className="page-header__tab page-header__tab--active">Overview</span>
            <a href="/admin/create" className="page-header__tab">Create</a>
          </div>
        </div>

        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        {concerts.map((concert) => (
          <ConcertCard
            key={concert.id}
            concert={concert}
            variant="admin"
            onDelete={() => setDeleteTarget(concert)}
          />
        ))}

        {concerts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
            No concerts yet. Create one!
          </p>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Confirm Delete"
          message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      </main>
    </div>
  );
}
