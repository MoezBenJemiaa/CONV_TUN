import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PageTrajet.module.css";
import Timeline from "./TimeLine";
import UserDetail from "./UserDetail";
import Passengers from "./Passengers";
import Reservation from "./Reservation";

export default function PageTrajet() {
  const { id } = useParams(); // Get trip ID from URL
  const [tripData, setTripData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch the trip by ID
    const fetchTrip = async () => {
      try {
        const tripRes = await fetch(`http://localhost:5000/trip/${id}`);
        const trip = await tripRes.json();
        setTripData(trip);

        // Fetch the user by email (from the trip owner)
        const userRes = await fetch(`http://localhost:5000/user/email/${trip.ownerEmail}`);
        const user = await userRes.json();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching trip or user data:", error);
      }
    };

    fetchTrip();
  }, [id]);

  const formatTripDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Date invalide"; // Check if the date is invalid
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };
  
  // Use tripData.date (not departureTime)
  const capitalizedDate = tripData?.date
    ? formatTripDate(tripData.date).charAt(0).toUpperCase() + formatTripDate(tripData.date).slice(1)
    : "Date non disponible";
  if (!tripData || !userData) return <div>Chargement...</div>;

  return (
    <div className={styles.pagetrajetContainer}>
      <div className={styles.trajetContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.date}>{capitalizedDate}</div>
          <Timeline className={styles.timelines} trip={tripData} />
          <UserDetail className={styles.userProfile} trip={tripData} user={userData} />
          <Passengers className={styles.passengers} tripId={id}/>
        </div>
        <Reservation className={styles.reservation} trip={tripData} user={userData}/>
      </div>
    </div>
  );
}
