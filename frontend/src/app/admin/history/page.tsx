'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import HistoryTable from '../../../components/HistoryTable';
import { api } from '../../../lib/api';
import type { ReservationLog } from '../../../types';

export default function AdminHistory() {
  const [logs, setLogs] = useState<ReservationLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAllLogs().then(setLogs).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="layout">
      <Sidebar role="admin" />
      <main className="layout__main">
        <h2 className="page-header__title" style={{ marginBottom: '1.5rem' }}>
          Reservation History
        </h2>

        {error && <div className="alert alert--error">{error}</div>}

        <HistoryTable logs={logs} />
      </main>
    </div>
  );
}
