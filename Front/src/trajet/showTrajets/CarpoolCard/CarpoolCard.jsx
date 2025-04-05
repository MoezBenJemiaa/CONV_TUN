import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa"; // Import star icon
import "./CarpoolCard.css";

const CarpoolCard = ({ rideId }) => {
  const [ride, setRide] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rideId) {
      console.error("No rideId provided!");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/trip/${rideId}`)
      .then((response) => {
        setRide(response.data);
        if (response.data.ownerEmail) {
          return axios.get(`http://localhost:5000/user/email/${response.data.ownerEmail}`);
        } else {
          throw new Error("Owner email is missing");
        }
      })
      .then((userResponse) => {
        setUser(userResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rideId]);

  // Extract only the main area from the address
  const extractLocationName = (fullAddress) => {
    if (!fullAddress) return "Unknown";
    const parts = fullAddress.split(",");
    return parts.length > 3 ? parts[3].trim() : fullAddress;
  };

  // Calculate duration (departure - arrival)
  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return "N/A";

    const parseTime = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const durationMinutes = parseTime(arrivalTime) - parseTime(departureTime);
    if (durationMinutes < 0) return "Invalid Time"; // Handle incorrect time entries

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}mn` : `${minutes}mn`;
  };

  if (loading) return <p>Loading trip details...</p>;
  if (!ride) return <p>Trip not found</p>;

  return (
    <div className="carpool-card" onClick={() => window.location.href = `/trip/${rideId}`}>
      <div className="trip-info">
        <div className="time-location">
          <span className="time">{ride.departureTime || "N/A"}</span>
          <span className="location">{extractLocationName(ride.departure?.name)}</span>
        </div>

        
        <div className="trip-duration">
          <div className="line-wrapper">
          <div className="circle-start" />
          <div className="line" />
          <span className="duration">{calculateDuration(ride.departureTime, ride.arrivalTime)}</span>
          <div className="line" />
          <div className="circle-end" />
        </div>


        </div>

        <div className="time-location">
          <span className="time">{ride.arrivalTime || "N/A"}</span>
          <span className="location">{extractLocationName(ride.arrival?.name)}</span>
        </div>
        
        <div className="price">{ride.price ? `${ride.price} DT` : "Price not available"}</div>
      </div>

      <div className="user-section">
        <div className="user-profile">
          <img className="avatar" src={"data:image/jpeg;base64," + (user?.profilePic || "/default-avatar.png")} alt="User Avatar" />
          <span className="username">{user?.firstName} {user?.lastName}</span>
        </div>


        <div className="preferences">
          {ride.preferences?.length > 0 ? (
            ride.preferences.map((pref, index) => (
              <span key={index} className="pref">{pref}</span>
            ))
          ) : (
            <span>No preferences</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarpoolCard;
