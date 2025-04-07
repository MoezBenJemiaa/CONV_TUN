import React from "react";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back(); // Uses browser's native history
  };

  return (
    <div className={styles.container}>
      <div className={styles.errorGraphic}>🚧</div>
      <h1 className={styles.title}>Erreur 404 – Page non trouvée</h1>
      <p className={styles.message}>
        La page que vous recherchez n’existe pas ou a été supprimée.
      </p>
      <button onClick={handleGoBack} className={styles.backButton}>
        ← Retourner
      </button>
      <div className={styles.suggestions}>
        <p>Sinon Essayer:</p>
        <a href="/" className={styles.link}>
          Page d'accueil
        </a>
        <a href="/contact" className={styles.link}>
          Contact
        </a>
      </div>
    </div>
  );
};

export default NotFound;
