import { React, useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { TbCalendarTime } from "react-icons/tb";
import { FiPlusCircle, FiMinusCircle, FiEdit2 } from "react-icons/fi";
import TripMap from "./TripMap";
import styles from "./Reservation.module.css";
import { MdWidthFull } from "react-icons/md";

export default function Reservation({ trip, user }) {
  const [passengers, setPassengers] = useState(1);
  const [totalPrice, setTotalPrice] = useState(trip.price);
  const [reservationStatus, setReservationStatus] = useState(false);

  useEffect(() => {
    const checkReservationStatus = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
      
      if (decodedToken) {
        const userId = decodedToken.id;
        const tripId = trip._id;

        try {
          const response = await fetch(
            `http://localhost:5000/reservation/check?tripId=${tripId}&userId=${userId}`
          );
          const data = await response.json();

          if (data.reserved) {
            setReservationStatus(true);
          }
        } catch (error) {
          console.error("Error checking reservation status:", error);
        }
      }
    };

    checkReservationStatus();
  }, [trip._id]);

  const handleClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Veuillez vous connecter pour réserver.");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const userEmail = decodedToken.email;
    const userId = decodedToken.id;

    if (userEmail === trip.ownerEmail) {
      alert("Vous ne pouvez pas réserver votre propre trajet !");
      return;
    }

    const tripId = trip._id;

    try {
      const response = await fetch("http://localhost:5000/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId,
          passengers,
          userEmail,
          userid: userId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Réservation réussie !");
        setReservationStatus(true);
      } else {
        alert(data.message || "Erreur lors de la réservation.");
      }
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("Une erreur est survenue.");
    }
  };

  const handleCancel = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;
    const tripId = trip._id;

    try {
      const response = await fetch("http://localhost:5000/reservation/cancel", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Réservation annulée.");
        setReservationStatus(false);
      } else {
        alert(data.message || "Erreur lors de l'annulation.");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Une erreur est survenue.");
    }
  };

  const formatTripDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Date invalide";
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const capitalizedDate = trip?.date
    ? formatTripDate(trip.date).charAt(0).toUpperCase() +
      formatTripDate(trip.date).slice(1)
    : "Date non disponible";

  const tripDetails = {
    price: trip.price,
    maxPassengers: trip.maxPassengers,
  };
  const [passengersReserved, setPassengersReserved] = useState([]);
  
  const fetchPassengersReserved = async () => {
    try {
      const res = await fetch(`http://localhost:5000/reservation/trip/${trip._id}/passengers`);
      const data = await res.json();
      setPassengersReserved(data.passengers || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des passagers :", err);
    }
  };
  

  const handleIncrease = () => {
    fetchPassengersReserved();
    if (passengers < (tripDetails.maxPassengers-passengersReserved.length)) {
      setPassengers(passengers + 1);
      setTotalPrice((passengers + 1) * tripDetails.price);
    }
  };

  const handleDecrease = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
      setTotalPrice((passengers - 1) * tripDetails.price);
    }
  };
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    const checkReservationStatus = async () => {
      const token = localStorage.getItem("token");
      const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  
      if (decodedToken) {
        const userId = decodedToken.id;
        const userEmail = decodedToken.email;
        const tripId = trip._id;
  
        // Check ownership
        if (userEmail === trip.ownerEmail) {
          setIsOwner(true);
          return; // No need to check reservation if it's the owner
        }
  
        try {
          const response = await fetch(
            `http://localhost:5000/reservation/check?tripId=${tripId}&userId=${userId}`
          );
          const data = await response.json();
  
          if (data.reserved) {
            setReservationStatus(true);
          }
        } catch (error) {
          console.error("Error checking reservation status:", error);
        }
      }
    };
  
    checkReservationStatus();
  }, [trip._id, trip.ownerEmail]);
  

  return (
    <div className={styles.reservationContainer}>
      <div className={styles.date}>{capitalizedDate}</div>

      <TripMap departure={trip.departure} arrival={trip.arrival} />

      <div className={styles.userInfo}>
        {user.profilePic ? (
          <img
            src={"data:image/jpeg;base64," + user.profilePic}
            alt="Profile"
            className={styles.pdp}
          />
        ) : (
          <FaUserCircle className={styles.userIcon} />
        )}
        <span className={styles.userName}>{fullName}</span>
      </div>

      <div className={styles.passengerInfo}>
        <span className={styles.passenger}>
          {passengers} passager{passengers > 1 ? "s" : ""}
        </span>
        <span className={styles.price}>
          {Math.floor(totalPrice)}
          <span className={styles.priceSuperscript}>
            {`,` + ((totalPrice % 1) * 1000).toFixed(0)}
          </span>{" "}
          DT
        </span>

        <div className={styles.buttons}>
          <FiMinusCircle
            className={`${styles.icon} ${
              passengers <= 1 ? styles.disabledIcon : styles.activeIcon
            }`}
            onClick={passengers > 1 ? handleDecrease : undefined}
          />
          <FiPlusCircle
            className={`${styles.icon} ${
              passengers >= tripDetails.maxPassengers
                ? styles.disabledIcon
                : styles.activeIcon
            }`}
            onClick={passengers < tripDetails.maxPassengers ? handleIncrease : undefined}
          />
        </div>
      </div>

      {isOwner ? (
        <a href={`/modify-trip/${trip._id}`} className={styles.modifyButton} >
          <button>
            <FiEdit2 className={styles.icon} />
            Modifier le trajet
          </button>
        </a>
      ) : (
        <>
          <button
            className={styles.reservationButton}
            onClick={!reservationStatus ? handleClick : undefined}
            disabled={reservationStatus}
          >
            {reservationStatus ? (
              <Zap className={styles.icon} />
            ) : (
              <TbCalendarTime className={styles.icon} />
            )}
            {reservationStatus ? "Réservation effectuée" : "Demande de réservation"}
          </button>

          {reservationStatus && (
            <button className={styles.cancelButton} onClick={handleCancel}>
              Annuler la réservation
            </button>
          )}
        </>
      )}


      {/*reservationStatus && (
        <button className={styles.cancelButton} onClick={handleCancel}>
           Annuler la réservation
        </button>
      )*/}
    </div>
  );
}
