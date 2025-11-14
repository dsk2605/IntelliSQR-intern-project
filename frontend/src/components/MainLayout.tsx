// src/components/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const MainLayout = () => {
  const { logout, user } = useAuthStore();

  const onLogout = () => {
    logout();
  };

  return (
    <>
      <header
        style={{
          background: 'var(--color-card-background)',
          boxShadow: 'var(--shadow-sm)',
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          // Add z-index to ensure header is above background
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            <span style={{ color: 'var(--color-primary)' }}>Intelli</span>Task
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              Hello,{' '}
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {user?.name}
              </span>
            </span>
            <button
              onClick={onLogout}
              className="btn"
              style={{
                padding: '8px 16px',
                background: 'var(--color-danger)',
                color: 'white',
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* --- THIS IS THE UPDATED <main> ELEMENT --- */}
      <main
        style={{
          maxWidth: 900,
          margin: '2rem auto',
          padding: '0 2rem',

          // --- "TO-DO LIST" THEME BACKGROUND ---
          // This adds the same dot grid as the auth page,
          // but we use a subtle, transparent version of our
          // border color so it's not distracting.
          backgroundImage: `
            radial-gradient(rgba(55, 65, 81, 0.5) 0.5px, transparent 0.5px),
            radial-gradient(rgba(55, 65, 81, 0.5) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '15px 15px',
          backgroundPosition: '0 0, 7.5px 7.5px',
          // ------------------------------------
        }}
      >
        <Outlet />
      </main>
    </>
  );
};