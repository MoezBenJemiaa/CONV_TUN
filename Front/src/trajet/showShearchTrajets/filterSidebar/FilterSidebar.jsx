import React from "react";
import "./FilterSidebar.css";

const FilterSidebar = ({ filters, setFilters, rides }) => {
  const departureCounts = {
    "avant 06:00": 0, "06:00 - 08:00": 0, "08:00 - 12:00": 0,
    "12:00 - 15:00": 0, "15:00 - 18:00": 0, "après 18:00": 0
  };

  const serviceCounts = {
    "Max 2 à l’arrière": 0,
    "Réservation instantanée": 0,
    "Cigarette autorisée": 0,
    "Bagage lourd": 0
  };

  rides.forEach((ride) => {
    const rideHour = parseInt(ride.departureTime?.split(":")[0], 10);
    
    if (rideHour < 6) departureCounts["avant 06:00"]++;
    else if (rideHour < 8) departureCounts["06:00 - 08:00"]++;
    else if (rideHour < 12) departureCounts["08:00 - 12:00"]++;
    else if (rideHour < 15) departureCounts["12:00 - 15:00"]++;
    else if (rideHour < 18) departureCounts["15:00 - 18:00"]++;
    else departureCounts["après 18:00"]++;

    if (ride.preferences.includes("maxTwoBack")) serviceCounts["Max 2 à l’arrière"]++;
    if (ride.reservationType === "instant") serviceCounts["Réservation instantanée"]++;
    if (ride.preferences.includes("smokingAllowed")) serviceCounts["Cigarette autorisée"]++;
    if (ride.preferences.includes("heavyLuggage")) serviceCounts["Bagage lourd"]++;
  });

  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const updatedList = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updatedList };
    });
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <div className="filter-header">
          <span>Trier par</span>
          <a href="#" className="clear-filters" onClick={() => setFilters({ sortBy: "departEarliest", departureTimes: [], services: [] })}>
            tout effacer
          </a>
        </div>
        {["departEarliest", "lowestPrice", "closestDeparture", "closestArrival", "shortestTrip"].map((value, index) => (
          <label key={value}>
            <input type="radio" name="sort" checked={filters.sortBy === value} onChange={() => setFilters({ ...filters, sortBy: value })} />
            {["Départ le plus tôt", "Prix le plus bas", "Proche du point de départ", "Proche du point d’arrivée", "Trajet le plus court"][index]}
          </label>
        ))}
      </div>

      <hr />

      {["departureTimes", "services"].map((category, index) => (
        <div className="filter-section" key={category}>
          <div className="filter-title">{["Heure de départ", "Services"][index]}</div>
          {Object.entries(index === 0 ? departureCounts : serviceCounts).map(([name, count]) => (
            <label key={name}>
              <input type="checkbox" checked={filters[category].includes(name)} onChange={() => handleCheckboxChange(category, name)} />
              {name} <span className="count">{count}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;
