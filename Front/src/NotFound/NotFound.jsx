import React from 'react';
import styles from './NotFound.module.css';

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back(); // Uses browser's native history
  };

  return (
    <div className={styles.container}>
      <div className={styles.errorGraphic}>🚧</div>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>
        The page you're looking for doesn't exist or was removed.
      </p>
      <button onClick={handleGoBack} className={styles.backButton}>
        ← Go Back
      </button>
      <div className={styles.suggestions}>
        <p>Or try:</p>
        <a href="/" className={styles.link}>Homepage</a>
        <a href="/contact" className={styles.link}>Contact</a>
      </div>
    </div>
  );
};

export default NotFound;