'use client';

import type { ReservationLog } from '../types';

interface HistoryTableProps {
  logs: ReservationLog[];
}

export default function HistoryTable({ logs }: HistoryTableProps) {
  return (
    <div className="table-wrapper">
      <table className="history-table">
        <thead>
          <tr>
            <th>Date/time</th>
            <th>Username</th>
            <th>Concert name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={4} className="history-table__empty">
                No reservation history
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.user?.username}</td>
                <td>{log.concert?.name}</td>
                <td>
                  <span
                    className={`badge ${log.action === 'reserve' ? 'badge--success' : 'badge--danger'}`}
                  >
                    {log.action}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
