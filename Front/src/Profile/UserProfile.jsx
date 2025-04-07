import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import { FaUserCircle, FaCheckCircle, FaMusic, FaRegCommentDots } from "react-icons/fa";
import { CigaretteOff } from 'lucide-react';
import { IoChatboxEllipses } from "react-icons/io5";
import { MdDoNotDisturb } from "react-icons/md";

function UserProfile() {
  const { idUser } = useParams();
  const token = localStorage.getItem("token");
  let isOwner = false;

  if (token) {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (decoded.id === idUser) {
      isOwner = true;
    }
  } catch (e) {
    console.error("Failed to decode token", e);
  }
  }
  const [user, setUser] = useState(null);
  const [tripCount, setTripCount] = useState(0);
  const [firstTripDate, setFirstTripDate] = useState(null);

  useEffect(() => {
    const fetchUserDataAndTrips = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${idUser}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData);

        // Fetch trips using user email
        const tripsRes = await fetch(
          `http://localhost:5000/trip/user/${userData.email}`
        );
        const trips = await tripsRes.json();

        setTripCount(trips.length);

        if (trips.length > 0) {
          const sorted = [...trips].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setFirstTripDate(sorted[0].date);
        }
      } catch (error) {
        console.error("Error fetching user or trip data:", error);
      }
    };

    fetchUserDataAndTrips();
  }, [idUser]);

  const formatDateToFrenchMonthYear = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.card}>
      <div className={styles.profileHeader}>
        {user.profilePic ? (
          <img
            src={`data:image/jpeg;base64,${user.profilePic}`}
            alt="Profile"
            className={styles.profileimg}
          />
        ) : (
          <FaUserCircle className={styles.profileIcon} />
        )}
        <div>
          <h1 className={styles.title}>
            {user.firstName + " " + user.lastName}
          </h1>
          <p className={styles.username}>{user.age} ans</p>
          {isOwner && (
            <a href={`/modify-profile`} className={styles.editLink}>
              Modifier mon profil
            </a>
          )}

        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {user.firstName} a un Profil Vérifié
        </h2>
        <ul className={styles.verificationList}>
          <li className={styles.verificationItem}>
            <FaCheckCircle className={styles.checkbox} />
            <label>Pièce d'identité vérifiée</label>
          </li>
          <li className={styles.verificationItem}>
            <FaCheckCircle className={styles.checkbox} />
            <label>Adresse e-mail vérifiée</label>
          </li>
          <li className={styles.verificationItem}>
            <FaCheckCircle className={styles.checkbox} />
            <label>Numéro de téléphone vérifié</label>
          </li>
        </ul>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Faites connaissance avec {user.firstName}
        </h2>
        <ul className={styles.preferencesList}>
          <li className={styles.preferenceItem}>
            <FaRegCommentDots className={styles.chatIcon} />
            <label>J'aime bien discuter quand je me sens à l'aise</label>
          </li>
          <li className={styles.preferenceItem}>
            <FaMusic className={styles.musicIcon} />
            <label>Musique tout le long !</label>
          </li>
          <li className={styles.preferenceItem}>
            <CigaretteOff className={styles.noSmokingIcon} />
            <label>Pas de cigarette, svp</label>
          </li>
        </ul>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.stats}>
        <p className={styles.tripCount}>
          {tripCount} trajet{tripCount > 1 ? "s" : ""} publié
          {tripCount > 1 ? "s" : ""}
        </p>
        {firstTripDate && (
          <p className={styles.PremierTrajet}>
            A publié son premier trajet en{" "}
            {formatDateToFrenchMonthYear(firstTripDate)}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
