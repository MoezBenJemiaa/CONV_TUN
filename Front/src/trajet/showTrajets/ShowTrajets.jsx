import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import for URL params
import axios from "axios";
import CarpoolCard from "./CarpoolCard/CarpoolCard";
import FilterSidebar from "./filterSidebar/FilterSidebar";
import styles from "./ShowTrajet.module.css";

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
          if (timeRange === "06:00 - 08:00")
            return rideHour >= 6 && rideHour < 8;
          if (timeRange === "08:00 - 12:00")
            return rideHour >= 8 && rideHour < 12;
          if (timeRange === "12:00 - 15:00")
            return rideHour >= 12 && rideHour < 15;
          if (timeRange === "15:00 - 18:00")
            return rideHour >= 15 && rideHour < 18;
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
  const getDurationInMinutes = (ride) => {
    try {
      if (!ride.departureTime || !ride.arrivalTime) return Infinity;

      const [startHour, startMin] = ride.departureTime.split(":").map(Number);
      const [endHour, endMin] = ride.arrivalTime.split(":").map(Number);

      if (
        isNaN(startHour) ||
        isNaN(startMin) ||
        isNaN(endHour) ||
        isNaN(endMin)
      ) {
        return Infinity; // if parsing fails
      }

      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;

      // Handle overnight trips
      const duration =
        endTotal >= startTotal
          ? endTotal - startTotal
          : 24 * 60 - startTotal + endTotal;

      return duration;
    } catch (e) {
      return Infinity;
    }
  };

  const sortRides = (rides) => {
    return [...rides].sort((a, b) => {
      if (filters.sortBy === "departEarliest") {
        return a.departureTime.localeCompare(b.departureTime);
      }

      if (filters.sortBy === "lowestPrice") {
        return a.price - b.price;
      }

      if (filters.sortBy === "shortestTrip") {
        return getDurationInMinutes(a) - getDurationInMinutes(b);
      }

      return 0;
    });
  };

  const filteredAndSortedRides = sortRides(filterRides(rides));

  if (loading) return <p>Loading rides...</p>;

  return (
    <div className={styles.trajetContainer}>
      <FilterSidebar filters={filters} setFilters={setFilters} rides={rides} />
      <div className={styles.trajetList}>
        <h2 className={styles.trajetTitle}>
          {filteredAndSortedRides.length} trajets publiés
        </h2>
        {filteredAndSortedRides.map((ride) => (
          <CarpoolCard key={ride._id} rideId={ride._id} />
        ))}
        {filteredAndSortedRides.length === 0 && <p>Aucun trajet trouvé.</p>}
      </div>
    </div>
  );
}

export default ShowTrajet;
