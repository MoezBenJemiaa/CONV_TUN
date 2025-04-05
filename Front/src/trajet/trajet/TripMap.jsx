// TripMap.js
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker icon fix
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to update map bounds
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

export default function TripMap({ departure, arrival }) {
  const [routeCoords, setRouteCoords] = useState([]);

  const departureCoord = [
    departure.coordinates.lat,
    departure.coordinates.lng,
  ];
  const arrivalCoord = [arrival.coordinates.lat, arrival.coordinates.lng];

  useEffect(() => {
    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${departure.coordinates.lng},${departure.coordinates.lat};${arrival.coordinates.lng},${arrival.coordinates.lat}?overview=full&geometries=geojson`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const coords = data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);
        setRouteCoords(coords);
      } catch (error) {
        console.error("Failed to fetch route from OSRM:", error);
      }
    };

    fetchRoute();
  }, [departure, arrival]);

  const bounds = [departureCoord, arrivalCoord, ...routeCoords];

  return (
    <MapContainer
      center={departureCoord}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Fit to route bounds */}
      <FitBounds bounds={bounds} />

      {/* Markers */}
      <Marker position={departureCoord} icon={icon}>
        <Popup>Départ: {departure.name}</Popup>
      </Marker>
      <Marker position={arrivalCoord} icon={icon}>
        <Popup>Arrivée: {arrival.name}</Popup>
      </Marker>

      {/* Route Polyline */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" weight={5} />
      )}
    </MapContainer>
  );
}
