import React, { useEffect, useState } from "react";
import styles from "./Passengers.module.css";
import { ChevronRight } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

export default function Passengers({ tripId }) {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reservation/trip/${tripId}/passengers`);
        const data = await res.json();
        setPassengers(data.passengers || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des passagers :", err);
      }
    };

    if (tripId) {
      fetchPassengers();
    }
  }, [tripId]);

  if (passengers.length === 0) return null;

  return (
    <div className={styles.passengersContainer}>
      <h3 className={styles.title}>Passagers</h3>
      <ul className={styles.passengerList}>
        {passengers.map((passenger) => (
          <li key={passenger.id}>
            <button className={styles.passengerItem} onClick={() => {window.location.href = "/Profile/" + passenger.id; }}>
              {passenger.profilePic ? (
                <img
                  src={`data:image/jpeg;base64,${passenger.profilePic}`}
                  alt="Profile"
                  className={styles.profileIcon}
                />
              ) : (
                <FaUserCircle className={styles.profileIcon} />
              )}
              <div className={styles.passengerInfo}>
                <span className={styles.passengerName}>{passenger.name}</span>
              </div>
              <ChevronRight className={styles.chevronIcon} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
