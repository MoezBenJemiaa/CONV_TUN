import React from 'react';
import styles from './loading.module.css';
import wheelImage from '../pictures/steering-wheel.png';

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.wheelTrack}>
        <div className={styles.wheelPivot}>
          <img 
            src={wheelImage} 
            className={styles.steeringWheel} 
            alt="Loading"
            draggable="false"
          />
        </div>
      </div>
      <p className={styles.loadingText}>veuillez patientez . . .</p>
    </div>
  );
}

export default Loading;
