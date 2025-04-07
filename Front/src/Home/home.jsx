import React, { useState } from "react";
import "./home.css";
import Footer from "../Footer/footer";
import bg1 from "../pictures/bg1.jpg";
import bg2 from "../pictures/bg2.jpg";
import LocationSelectorMap from "../trajet/PublishTrip/LocationSelectorMap";
import { CiMap } from "react-icons/ci";
import { FaRegUser, FaRegAddressCard } from "react-icons/fa";
import { LiaCoinsSolid } from "react-icons/lia";
import { LuUserRoundCheck, LuZap } from "react-icons/lu";
import { MapIcon } from "lucide-react";
import axios from "axios";

const HomePage = () => {
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
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent page reload

    if (!departure.coordinates || !arrival.coordinates) {
      alert("Veuillez sélectionner un point de départ et d'arrivée.");
      return;
    }

    const selectedDate = document.querySelector(".dateInput").value;
    const seatsRequired = parseInt(
      document.querySelector("#seatsInput").value,
      10
    );

    if (!selectedDate) {
      alert("Veuillez sélectionner une date.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/trip/search", {
        departure: departure.coordinates,
        arrival: arrival.coordinates,
        date: selectedDate,
        seatsRequired: seatsRequired || 1, // Default to 1 if empty
      });

      const matchingTrips = response.data;

      if (matchingTrips.length === 0) {
        alert("Aucun trajet trouvé correspondant à vos critères.");
        return;
      }

      // Extract trip IDs and redirect
      const tripIds = matchingTrips.map((trip) => trip._id).join(",");
      window.location.href = `/Trajets/${tripIds}`;
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      alert("Erreur lors de la recherche des trajets.");
    }
  };

  return (
    <div className="homeContainer">
      <div className="carimg">
        <img src={bg1} alt="Car ride" />
      </div>

      <form className="form" onSubmit={handleSearch}>
        <div className="inputRow">
          <div className="inputGroup">
            <MapIcon
              className="icon"
              onClick={() => {
                setSelecting("departure");
                setShowMap(true);
              }}
            />
            <input
              type="text"
              placeholder="Départ"
              value={departure.name}
              onClick={() => {
                setSelecting("departure");
                setShowMap(true);
              }}
            />
          </div>

          <div className="inputGroup">
            <MapIcon
              className="icon"
              onClick={() => {
                setSelecting("arrival");
                setShowMap(true);
              }}
            />
            <input
              type="text"
              placeholder="Arrivée"
              value={arrival.name}
              onClick={() => {
                setSelecting("arrival");
                setShowMap(true);
              }}
            />
          </div>

          <div className="inputGroup">
            <input
              type="date"
              className="dateInput"
              placeholder="Sélectionnez une date"
            />
          </div>

          <div className="inputGroup">
            <FaRegUser className="userIcon" />
            <input
              type="number"
              id="seatsInput"
              placeholder="1 passager"
              min="1"
            />
          </div>
          <button type="submit">Rechercher</button>
        </div>
      </form>

      <div className="features">
        <div className="features_container">
          <div className="feat">
            <LiaCoinsSolid className="icon" />
            <h3>Vos trajets préférés à petits prix</h3>
            <p>
              Où que vous alliez, trouvez le trajet idéal parmi notre large
              choix de destinations à petits prix.
            </p>
          </div>

          <div className="feat">
            <FaRegAddressCard className="icon" />
            <h3>Voyagez en toute confiance</h3>
            <p>
              Nous prenons le temps qu'il faut pour connaître nos membres et nos
              compagnies de bus partenaires. Nous vérifions les avis, les
              profils et les pièces d'identité. Vous savez donc avec qui vous
              allez voyager pour réserver en toute confiance sur notre
              plateforme sécurisée.
            </p>
          </div>

          <div className="feat">
            <LuZap className="icon" />
            <h3>Recherchez, cliquez et réservez</h3>
            <p>
              Réserver un trajet devient encore plus simple ! Facile
              d'utilisation et dotée de technologies avancées, notre appli vous
              permet de réserver un trajet à proximité en un rien de temps.
            </p>
          </div>
        </div>
      </div>

      <div className="about">
        <div className="description">
          <h2>Votre sécurité est notre priorité</h2>
          <p>
            Chez Covoitun, nous nous sommes fixé comme objectif de construire
            une communauté de covoiturage fiable et digne de confiance à travers
            le monde. Rendez-vous sur notre page Confiance et sécurité pour
            explorer les différentes fonctionnalités disponibles pour covoiturer
            sereinement.
          </p>
        </div>
        <img src={bg2} alt="Happy people" />
      </div>
      <Footer></Footer>
      {showMap && (
        <div className="mapOverlay">
          <div className="mapContainer">
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
};

export default HomePage;
