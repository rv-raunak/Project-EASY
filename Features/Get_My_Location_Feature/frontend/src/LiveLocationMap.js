import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LiveLocationMap = () => {
  const [location, setLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [error, setError] = useState("");

  // 🔘 Fetch current location and save to DB
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setError("");

        try {
          await axios.post("http://localhost:5000/api/location/add", {
            latitude,
            longitude,
          });
          console.log("✅ Location saved to backend");
        } catch (err) {
          console.error("❌ Error saving to backend:", err);
        }
      },
      (err) => {
        setError("❌ Error fetching location.");
        console.error(err);
      }
    );
  };

  // 🔘 Load all saved coordinates from DB
  const handleViewLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/location/all");
      setSavedLocations(response.data);
      console.log("📍 Locations loaded:", response.data);
    } catch (err) {
      console.error("❌ Failed to load locations:", err);
    }
  };

  return (
    <div>
      <h2>📍 Live Location Tracker</h2>
      <button onClick={handleGetLocation}>Get My Location</button>
      <button onClick={handleViewLocations}>View Saved Locations</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {location && (
        <div>
          <h4>🧭 Current Location:</h4>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      <div style={{ height: "400px", marginTop: "20px" }}>
        <MapContainer
          center={[location?.latitude || 20.5937, location?.longitude || 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* 🔘 Marker for current location */}
          {location && (
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>📌 You are here</Popup>
            </Marker>
          )}

          {/* 🔘 Markers for saved locations */}
          {savedLocations.map((loc, index) => (
            <Marker key={index} position={[loc.latitude, loc.longitude]}>
              <Popup>
                Saved Location #{index + 1}
                <br />
                Lat: {loc.latitude}, Lng: {loc.longitude}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveLocationMap;
