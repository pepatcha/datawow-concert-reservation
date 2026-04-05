import Link from 'next/link';

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 2rem',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'white',
  textDecoration: 'none',
};

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing__content">
        <h1 className="landing__title">Concert Ticket Reservation</h1>
        <p className="landing__subtitle">
          Reserve your free concert tickets now
        </p>
        <div className="landing__actions">
          <Link href="/admin" style={{ ...btnBase, backgroundColor: '#2d8a6e' }}>
            Enter as Admin
          </Link>
          <Link href="/user" style={{ ...btnBase, backgroundColor: '#6c757d' }}>
            Enter as User
          </Link>
        </div>
      </div>
    </div>
  );
}
