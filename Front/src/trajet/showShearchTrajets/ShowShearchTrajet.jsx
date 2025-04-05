import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import for URL params
import axios from "axios";
import CarpoolCard from "./CarpoolCard/CarpoolCard";
import FilterSidebar from "./filterSidebar/FilterSidebar";
import "./ShowShearchTrajets.css";
import LocationSelectorMap from '../PublishTrip/LocationSelectorMap';
import { CiMap } from "react-icons/ci"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagic, 
  faGem, 
  faGlobeAsia,
  faCircle,
  faCalendarDays,
  faUser
} from '@fortawesome/free-solid-svg-icons';

function ShowTrajet({ rideIds }) {
  const { ids } = useParams(); // Get ride IDs from URL
  const rideIdArray = rideIds || (ids ? ids.split(",") : []); // Use props or URL param IDs

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sortBy: "departEarliest",
    departureTimes: [],
    services: [],
  });
  const [departure, setDeparture] = useState({ name: '', coordinates: null });
    const [arrival, setArrival] = useState({ name: '', coordinates: null });
    const [showMap, setShowMap] = useState(false);
    const [selecting, setSelecting] = useState('');
  
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
      const seatsRequired = parseInt(document.querySelector("#seatsInput").value, 10);
    
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
    }
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const rideRequests = rideIdArray.map((id) =>
          axios.get(`http://localhost:5000/trip/${id}`)
        );
        const rideResponses = await Promise.all(rideRequests);
        setRides(rideResponses.map((res) => res.data));
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    if (rideIdArray.length > 0) {
      fetchRides();
    } else {
      setLoading(false);
    }
  }, [rideIdArray]);

  const filterRides = (rides) => {
    return rides.filter((ride) => {
      const rideHour = parseInt(ride.departureTime?.split(":")[0], 10);

      // Filter by Departure Time
      if (filters.departureTimes.length > 0) {
        const matchesTime = filters.departureTimes.some((timeRange) => {
          if (timeRange === "avant 06:00") return rideHour < 6;
          if (timeRange === "06:00 - 08:00") return rideHour >= 6 && rideHour < 8;
          if (timeRange === "08:00 - 12:00") return rideHour >= 8 && rideHour < 12;
          if (timeRange === "12:00 - 15:00") return rideHour >= 12 && rideHour < 15;
          if (timeRange === "15:00 - 18:00") return rideHour >= 15 && rideHour < 18;
          if (timeRange === "après 18:00") return rideHour >= 18;
          return false;
        });
        if (!matchesTime) return false;
      }

      // Filter by Services
      if (filters.services.length > 0) {
        const hasAllServices = filters.services.every((service) => {
          if (ride.preferences?.includes(service)) return true;
          switch (service) {
            case "Réservation instantanée":
              return ride.reservationType === "instant";
            case "Max 2 à l’arrière":
              return ride.preferences.includes("maxTwoBack");
            case "Cigarette autorisée":
              return ride.preferences.includes("smokingAllowed");
            case "Bagage lourd":
              return ride.preferences.includes("heavyLuggage");
            default:
              return false;
          }
        });

        if (!hasAllServices) return false;
      }

      return true;
    });
  };

  const sortRides = (rides) => {
    return [...rides].sort((a, b) => {
      if (filters.sortBy === "departEarliest")
        return a.departureTime.localeCompare(b.departureTime);
      if (filters.sortBy === "lowestPrice") return a.price - b.price;
      return 0;
    });
  };

  const filteredAndSortedRides = sortRides(filterRides(rides));

  if (loading) return <p>Loading rides...</p>;

  return (
    
    <div className="trajet-container">
       <form className="form" onSubmit={handleSearch}>
        <div className="inputRow">
          <div className="inputGroup">
            <CiMap
              className="CiMap"
              onClick={() => {
                setSelecting("departure");
                setShowMap(true);
              }}
            />
            <input type="text" placeholder="Départ" value={departure.name} disabled />
          </div>
      
          <div className="inputGroup">
            <CiMap
              className="CiMap"
              onClick={() => {
                setSelecting("arrival");
                setShowMap(true);
              }}
            />
            <input type="text" placeholder="Arrivée" value={arrival.name} disabled />
          </div>
      
          <div className="inputGroup">
            <span>
              <FontAwesomeIcon icon={faCalendarDays} />
            </span>
            <input type="date" className="dateInput" placeholder="Sélectionnez une date" />
          </div>
      
          <div className="inputGroup">
            <span>
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input type="number" id="seatsInput" placeholder="1 passager" min="1" />
          </div>
      
          <button type="submit">Rechercher</button>
        </div>
      </form>

      <FilterSidebar filters={filters} setFilters={setFilters} rides={rides} />
      <div className="trajet-list">
        <h2 className="trajet-title">{filteredAndSortedRides.length} trajets disponibles</h2>
        {filteredAndSortedRides.map((ride) => (
          <CarpoolCard key={ride._id} rideId={ride._id}/>
        ))}
        {filteredAndSortedRides.length === 0 && <p>Aucun trajet trouvé.</p>}
      </div>
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
                cursor: "pointer"
              }}
            >X</button>

            {/* Map Component */}
            <LocationSelectorMap key={showMap} onLocationSelect={handleLocationSelect} />

            {/* Show Selected Location Name Below the Map */}
            {selecting === "departure" && departure.name && (
              <p style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
                📍 Départ sélectionné: {departure.name}
              </p>
            )}
            {selecting === "arrival" && arrival.name && (
              <p style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
                📍 Arrivée sélectionnée: {arrival.name}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ShowTrajet;
