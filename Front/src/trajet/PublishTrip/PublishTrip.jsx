import React, { useState } from "react";
import LocationSelectorMap from "./LocationSelectorMap";
import styles from "./PublishTrip.module.css";
import { CiMap } from "react-icons/ci";
import { MapIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { famap } from "@fortawesome/free-solid-svg-icons";

function PublishTrip() {
  const [stops, setStops] = useState([{ name: "", price: "" }]);
  const [reservationType, setReservationType] = useState("instant");
  const [preferences, setPreferences] = useState({
    maxTwoBack: false,
    smokingAllowed: false,
    heavyLuggage: false,
  });
  const [departure, setDeparture] = useState({ name: "", coordinates: null });
  const [arrival, setArrival] = useState({ name: "", coordinates: null });
  const [showMap, setShowMap] = useState(false);
  const [selecting, setSelecting] = useState("");

  const handleLocationSelect = (location) => {
    if (selecting === "departure") {
      setDeparture(location); // Updates both name and coordinates
    } else if (selecting === "arrival") {
      setArrival(location);
    }
    /*setShowMap(false);*/
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

  const addStop = () => {
    setStops([...stops, { name: "", price: "" }]);
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...stops];
    updatedStops[index][field] = value;
    setStops(updatedStops);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const ownerEmail = decodedToken.email;

    const formData = new FormData();
    formData.append("departureName", departure.name);
    formData.append(
      "departureCoordinates",
      JSON.stringify(departure.coordinates)
    ); // Send coordinates
    formData.append("arrivalName", arrival.name);
    formData.append("arrivalCoordinates", JSON.stringify(arrival.coordinates));
    formData.append(
      "departureTime",
      document.querySelector('input[placeholder="Horraire de depart"]').value
    );
    formData.append(
      "arrivalTime",
      document.querySelector('input[placeholder="Horraire d’arrivee"]').value
    );
    formData.append(
      "date",
      document.querySelector('input[placeholder="Date du trajet"]').value
    );
    formData.append(
      "maxPassengers",
      document.querySelector('input[placeholder="nbr max passagers"]').value
    );
    formData.append(
      "price",
      document.querySelector('input[placeholder="prix"]').value
    );
    formData.append("reservationType", reservationType);
    formData.append("description", document.querySelector("textarea").value);
    formData.append("ownerEmail", ownerEmail);
    formData.append("stops", JSON.stringify(stops));
    const selectedPreferences = Object.keys(preferences).filter(
      (key) => preferences[key]
    );
    formData.append("preferences", selectedPreferences.join(","));

    formData.append(
      "vehicleType",
      document.querySelector(
        'input[placeholder="Type voiture (e.g: Peugot 3008)"]'
      ).value
    );
    formData.append(
      "vehicleColor",
      document.querySelector('input[placeholder="Couleur voiture"]').value
    );
    formData.append(
      "vehiclePlate",
      document.querySelector(
        'input[placeholder="Matricule (e.g: 123 TU 4567)"]'
      ).value
    );

    try {
      const response = await fetch("http://localhost:5000/publish-trip", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Trip published successfully!");
        handMesTrajets(); // Redirect to the user's trips page
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to publish trip. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset all states
    setStops([{ name: "", price: "" }]);
    setReservationType("instant");
    setPreferences({
      maxTwoBack: false,
      smokingAllowed: false,
      heavyLuggage: false,
    });

    // Reset input fields manually
    document
      .querySelectorAll("input, textarea")
      .forEach((input) => (input.value = ""));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Publier un trajet</h2>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Info trajet</h3>

          <div className={styles.departure}>
            <div className={styles.champ}>
              {/*<input type="text" placeholder="Depart" className={styles.input} />
               */}

              <input
                type="text"
                placeholder="Départ"
                className={styles.input}
                value={departure.name}
                onChange={(e) =>
                  setDeparture({ ...departure, name: e.target.value })
                }
                onClick={() => {
                  setSelecting("departure");
                  setShowMap(true);
                }}
              />
              <MapIcon
                className={styles.map}
                onClick={() => {
                  setSelecting("departure");
                  setShowMap(true);
                }}
              />
            </div>

            {stops.map((stop, index) => (
              <div key={index} className={styles.stopContainer}>
                <h5>Arrêt {index + 1}</h5>
                <input
                  type="text"
                  placeholder="Petit d'arrêt"
                  className={styles.input}
                  value={stop.name}
                  onChange={(e) =>
                    handleStopChange(index, "name", e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Prix"
                  className={styles.input}
                  value={stop.price}
                  onChange={(e) =>
                    handleStopChange(index, "price", e.target.value)
                  }
                />
                {index === stops.length - 1 && (
                  <button className={styles.addButton} onClick={addStop}>
                    Ajouter un autre arrêt
                  </button>
                )}
              </div>
            ))}

            <div className={styles.champ}>
              {/*<input type="text" placeholder="Arrivee" className={styles.input} />
               */}
              <input
                type="text"
                placeholder="Arrivée"
                className={styles.input}
                value={arrival.name}
                onChange={(e) =>
                  setArrival({ ...arrival, name: e.target.value })
                }
                onClick={() => {
                  setSelecting("departure");
                  setShowMap(true);
                }}
              />
              <MapIcon
                className={styles.map}
                onClick={() => {
                  setSelecting("arrival");
                  setShowMap(true);
                }}
              />
            </div>

            <div className={styles.champ}>
              <input
                type="time"
                placeholder="Horraire de depart"
                className={styles.input}
              />
            </div>
            <div className={styles.champ}>
              <input
                type="time"
                placeholder="Horraire d’arrivee"
                className={styles.input}
              />
            </div>
            <div className={styles.champ}>
              <input
                type="date"
                placeholder="Date du trajet"
                className={styles.input}
              />
            </div>
            <div className={styles.champ}>
              <input
                type="number"
                placeholder="nbr max passagers"
                className={styles.input}
              />
            </div>
            <div className={styles.champ}>
              <input
                type="number"
                placeholder="prix"
                className={styles.input}
              />
            </div>
            <div className={`${styles.champ} `}>
              <div className={styles.champ}>
                <input
                  type="text"
                  placeholder="Type voiture (e.g: Peugeot 3008)"
                  className={styles.input}
                />
              </div>
              <div className={styles.champ}>
                <input
                  type="text"
                  placeholder="Couleur voiture"
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.champ}>
              <input
                type="text"
                placeholder="Matricule (e.g: 123 TU 4567)"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <hr />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Services et equipements</h3>

          <div className={styles.reservationType}>
            <h4 className={styles.subtitle}>Type reservation</h4>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="reservationType"
                value="instant"
                checked={reservationType === "instant"}
                onChange={() => setReservationType("instant")}
              />
              Reservation instantanee
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="reservationType"
                value="request"
                checked={reservationType === "request"}
                onChange={() => setReservationType("request")}
              />
              Reservation selon une demande
            </label>
          </div>

          <div className={styles.preferences}>
            <h4 className={styles.subtitle}>Préférences</h4>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={preferences.maxTwoBack}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    maxTwoBack: e.target.checked,
                  })
                }
              />
              Max 2 à l'arrière
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={preferences.smokingAllowed}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    smokingAllowed: e.target.checked,
                  })
                }
              />
              Cigarette autorisée
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={preferences.heavyLuggage}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    heavyLuggage: e.target.checked,
                  })
                }
              />
              Baggage lourd
            </label>
          </div>

          <hr />

          <div className={styles.description}>
            <h4 className={styles.subtitle}>Ajouter une description</h4>
            <textarea
              placeholder="Léguer ici votre texte"
              className={styles.textarea}
            ></textarea>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Annuler
          </button>
          <button className={styles.confirmButton} onClick={handleSubmit}>
            Confirmer
          </button>
        </div>
      </div>
      {showMap && (
        <div className={styles.mapOverlay}>
          <div className={styles.mapContainer}>
            <button
              onClick={() => setShowMap(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              X
            </button>

            {/* Map Component */}
            <LocationSelectorMap
              key={showMap}
              onLocationSelect={handleLocationSelect}
            />

            {/* Show Selected Location Name Below the Map */}
            {selecting === "departure" && departure.name && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                📍 Départ sélectionné: {departure.name}
              </p>
            )}
            {selecting === "arrival" && arrival.name && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                📍 Arrivée sélectionnée: {arrival.name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PublishTrip;
