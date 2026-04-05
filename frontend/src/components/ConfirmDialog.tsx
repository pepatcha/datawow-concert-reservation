'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const btnBase: React.CSSProperties = {
    padding: '0.5rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    color: 'white',
  };

  return (
    <div className="dialog-overlay" onClick={loading ? undefined : onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog__title">{title}</h3>
        <p className="dialog__message">{message}</p>
        <div className="dialog__actions">
          <button
            style={{ ...btnBase, backgroundColor: '#6c757d' }}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            style={{ ...btnBase, backgroundColor: '#dc3545', opacity: loading ? 0.7 : 1 }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
