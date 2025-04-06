import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell  } from "@fortawesome/free-solid-svg-icons";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;

      try {
        const response = await fetch(`http://localhost:5000/notifications/${userId}`);
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsSeen = async (id) => {
    
    try {
      const response = await fetch(`http://localhost:5000/notifications/seen/${id}`, {
        method: "PATCH"
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, seen: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Notifications</div>
      <div className={styles.list}>
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className={`${styles.notificationCard} ${
              !notif.seen ? styles.selected : ""
            }`}
            
          >
            <div className={styles.notificationHeader} onClick={()=> window.location.href = "/trip/"+notif.tripId   }>
              <FontAwesomeIcon icon={faBell} className={styles.userIcon} />
              <div className={styles.content}>
                <div className={styles.name}>
                  {notif.text}
                </div>
                <div className={styles.time}>
                  {new Date(notif.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>

            {!notif.seen && (
              <div className={styles.actions}>
                <button
                  className={styles.seenButton}
                  onClick={() => handleMarkAsSeen(notif._id)}
                >
                  Marquer comme vu
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
