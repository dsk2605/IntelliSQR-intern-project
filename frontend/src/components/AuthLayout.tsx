import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';
import { AppLogo } from './AppLogo'; 

export const AuthLayout = () => {
  return (
    <div className={styles.authContainer}>
      
      <div className={styles.brandPanel}>
        <AppLogo />
        <h1>
          Welcome to <span>IntelliTask</span>
        </h1>
        <p className={styles.tagline}>
          Focus on what matters. Organize your work and life.
        </p>
      </div>

    
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
        
          <Outlet />
        </div>
      </div>
    </div>
  );
};