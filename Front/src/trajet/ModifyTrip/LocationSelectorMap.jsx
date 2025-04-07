import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icon in Leaflet
const customMarkerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationSelectorMap = ({ onLocationSelect }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setSelectedPosition([lat, lng]);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location name");
          }

          const data = await response.json();
          const locationName = data.display_name || "Unknown Location";

          // Send the name and coordinates to the parent component
          onLocationSelect({ name: locationName, coordinates: { lat, lng } });
        } catch (error) {
          console.error("Error fetching location:", error);
          onLocationSelect({ name: "Location Not Found", coordinates: { lat, lng } });
        }
      },
    });

    return selectedPosition ? (
      <Marker position={selectedPosition} icon={customMarkerIcon} />
    ) : null;
  }

  return (
    <MapContainer center={[36.5, 10.0]} zoom={8} style={{ height: "450px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
      {selectedPosition && <Marker position={selectedPosition} icon={customMarkerIcon} />}
    </MapContainer>
  );
};

export default LocationSelectorMap;
