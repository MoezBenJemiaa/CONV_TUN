import {
  ShieldCheck,
  CalendarCheck,
  CalendarX,
  Zap,
  Cigarette,
  CigaretteOff,
  ChevronRight,
} from "lucide-react";
import { FaUserCircle, FaCarSide, FaRegComments } from "react-icons/fa";
import { PiSeatbelt } from "react-icons/pi";
import { BsFillSuitcaseFill } from "react-icons/bs";
import { TbCalendarTime } from "react-icons/tb";
import { useState } from "react";
import styles from "./UserDetail.module.css";

export default function UserDetail({ user = {}, trip = {} }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => setIsExpanded(!isExpanded);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const description =
    trip.description ||
    "Ce conducteur n'a pas encore ajouté de description pour ce trajet.";

  // Default assumptions
  const verifiedProfile = true;
  const verifiedIdentity = !!user.idPhoto;
  const verifiedPhone = true; // modify as needed
  const cancelsOften = false;
  const preferences = trip.preferences || [];

  const instantBooking = trip.reservationType === "instant";
  const allowsSmoking = preferences.includes("smokingAllowed");
  const max2Backseat = preferences.includes("maxTwoBack");
  const allowsBaggage = preferences.includes("heavyLuggage");

  return (
    <div className={styles.profileCard}>
      {/* User Header */}
      <button className={styles.profileHeader} onClick={() => {window.location.href = "/Profile/" + user._id; }}>
      {user.profilePic ? (
          <img src={"data:image/jpeg;base64,"+user.profilePic} alt="Profile" className={styles.pdp} />
        ) : (
          <FaUserCircle className={styles.userIcon} />
        )}
        <span className={styles.userName}>{fullName}</span>
        <ChevronRight className={styles.chevronIcon} />
      </button>

      {/* Verified Status */}
      <div className={styles.verifiedInfo}>
        {verifiedProfile && (
          <div className={styles.verifiedItem}>
            <ShieldCheck className={styles.icon} /> profil vérifié
          </div>
        )}
        {verifiedIdentity && (
          <div className={styles.verifiedItem}>
            <ShieldCheck className={styles.icon} /> identité vérifiée
          </div>
        )}
        {verifiedPhone && (
          <div className={styles.verifiedItem}>
            <ShieldCheck className={styles.icon} /> numéro vérifié
          </div>
        )}
        <div className={styles.verifiedItem}>
          {cancelsOften ? (
            <>
              <CalendarX className={styles.checkRed} />
              annule souvent ces trajets
            </>
          ) : (
            <>
              <CalendarCheck className={styles.checkGreen} />
              annule rarement ces trajets
            </>
          )}
        </div>
      </div>

      {/* User Description */}
      <p className={`${styles.description} ${isExpanded ? styles.expanded : ""}`}>
        {description}
      </p>

      {description.length > 100 && (
        <button className={styles.readMore} onClick={handleToggle}>
          {isExpanded ? "Voir moins" : "Lire la suite"}
        </button>
      )}

      <hr className={styles.divider} />

      {/* Additional Info */}
      <ul className={styles.additionalInfo}>
        <li>
          {instantBooking ? (
            <Zap className={styles.iconInfo} />
          ) : (
            <TbCalendarTime className={styles.iconInfo} />
          )}
          {instantBooking
            ? "Votre réservation sera confirmée instantanément"
            : "Votre réservation sera confirmée lorsque le conducteur acceptera votre demande"}
        </li>

        <li>
          {allowsSmoking ? (
            <>
              <Cigarette className={styles.iconInfo} /> Voyager avec des fumeurs ne me dérange pas
            </>
          ) : (
            <>
              <CigaretteOff className={styles.iconInfo} /> Pas de cigarette, svp
            </>
          )}
        </li>

        {max2Backseat && (
          <li>
            <PiSeatbelt className={styles.iconInfo} /> Max 2 à l’arrière
          </li>
        )}

        {allowsBaggage && (
          <li>
            <BsFillSuitcaseFill className={styles.iconInfo} /> Bagage lourd autorisé
          </li>
        )}

        {trip.vehicle && (
          <li>
            <FaCarSide className={styles.iconInfo} /> {trip.vehicle.type} - {trip.vehicle.color}
          </li>
        )}
      </ul>

      <button className={styles.contactButton}>
        <FaRegComments className={styles.contactIcon} /> Contacter {fullName}
      </button>
    </div>
  );
}
