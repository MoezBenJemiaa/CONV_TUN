import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import styles from "./Header.module.css"; // Import CSS module
import logo from "../pictures/logofinal.png"; // Import logo

function Navbar() {
  const [profilePic, setProfilePic] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for dropdown menu

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.pdp) {
          setProfilePic(decodedToken.pdp);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to navigate to another page
  const handleNavigate = () => {
    window.location.href = "/PublishTrip"; // Redirect to another page
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const handMesTrajets = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      // Decode the token to get the email
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.email;

      if (!userEmail) {
        alert("Invalid token. No email found.");
        return;
      }

      // Fetch user-specific rides
      const response = await axios.get(
        `http://localhost:5000/trip/user/${userEmail}`
      );
      const userRides = response.data;

      if (userRides.length === 0) {
        alert("No rides found for this user.");
        return;
      }

      // Convert ride IDs into a URL-friendly string
      const rideIds = userRides.map((ride) => ride._id).join(",");
      window.location.href = `/MesTrajets/${rideIds}`;
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to load your rides. Try again later.");
    }
  };
  const GoToReservations = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Veuillez vous connecter pour voir vos réservations.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.id;

      if (!userID) {
        alert("Token invalide. Aucun e-mail trouvé.");
        return;
      }

      // Fetch user-specific rides (reservations)
      const response = await axios.get(
        `http://localhost:5000/reservation/user/${userID}`
      );
      const userReservations = response.data;

      if (userReservations.length === 0) {
        alert("Aucune réservation trouvée pour cet utilisateur.");
        return;
      }

      // Extract ride IDs and redirect
      const rideIds = userReservations.map((res) => res.trip).join(",");
      window.location.href = `/Reservations/${rideIds}`;
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de charger vos réservations. Réessayez plus tard.");
    }
  };

  const GoToHome = () => {
    window.location.href = "/";
  };
  const GoToLogin = () => {
    window.location.href = "/login";
  };
  const GoToRegister = () => {
    window.location.href = "/Register";
  };
  const GoToProfile = () => {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    const idUser = decodedToken.id;
    window.location.href = "/Profile/" + idUser;
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo (Image) */}
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} onClick={GoToHome} />
      </div>

      {/* Plus icon & User Icon & Dropdown */}
      <div className={styles.userSection} ref={dropdownRef}>
        {/* Plus Icon (Navigates to another page) */}
        <div className={styles.publish} onClick={handleNavigate}>
          <FiPlusCircle className={styles.icon} />
          Publier un trajet
        </div>

        <div className={styles.profile_container} ref={dropdownRef}>
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className={styles.profile_image}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          ) : (
            <FaUserCircle
              className={styles.icon}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          )}
        </div>
        
        <ChevronDown
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`${styles.chevron} ${dropdownOpen ? styles.rotated : ""}`}
        />

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className={styles.dropdown}>
            {(() => {
              const token = localStorage.getItem("token");

              return (
                <ul>
                  {token ? (
                    <>
                      <li className={styles.dropdownItem} onClick={GoToProfile}>
                        Profile
                        <ChevronRight className={styles.chevron} />
                      </li>
                      <li
                        className={styles.dropdownItem}
                        onClick={handMesTrajets}
                      >
                        Mes trajets
                        <ChevronRight className={styles.chevron} />
                      </li>
                      <li
                        className={styles.dropdownItem}
                        onClick={GoToReservations}
                      >
                        Reservations
                        <ChevronRight className={styles.chevron} />
                      </li>
                      <li className={`${styles.dropdownItem} `}>
                        Notifications
                        <ChevronRight className={styles.chevron} />
                      </li>
                      <li
                        className={`${styles.dropdownItem} ${styles.logout}`}
                        onClick={handleLogout}
                      >
                        <button>Déconnecter</button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className={styles.dropdownItem} onClick={GoToLogin}>
                        Connectez-vous
                        <ChevronRight className={styles.chevron} />
                      </li>
                      <li
                        className={styles.dropdownItem}
                        onClick={GoToRegister}
                      >
                        Inscrivez-vous
                        <ChevronRight className={styles.chevron} />
                      </li>
                    </>
                  )}
                </ul>
              );
            })()}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
