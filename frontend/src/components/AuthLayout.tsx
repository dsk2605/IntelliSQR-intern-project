// src/components/AuthLayout.tsx
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';
import { AppLogo } from './AppLogo'; // <-- Import our new logo

export const AuthLayout = () => {
  return (
    <div className={styles.authContainer}>
      {/* 1. Left "Brand" Panel */}
      <div className={styles.brandPanel}>
        <AppLogo />
        <h1>
          Welcome to <span>IntelliTask</span>
        </h1>
        <p className={styles.tagline}>
          Focus on what matters. Organize your work and life, finally.
        </p>
      </div>

      {/* 2. Right "Form" Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          {/* Outlet renders the Login or Signup page here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};