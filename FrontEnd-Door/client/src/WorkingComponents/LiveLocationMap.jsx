import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaLocationArrow,
  FaDatabase,
  FaSpinner,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Fix default icon issue in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LiveLocationMap = () => {
  const [location, setLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          await axios.post("http://localhost:5000/api/location/add", {
            latitude,
            longitude,
          });
          console.log("✅ Location saved to backend");
        } catch (err) {
          console.error("❌ Error saving to backend:", err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(
          "❌ Error fetching location. Please ensure location permissions are granted."
        );
        console.error(err);
        setIsLoading(false);
      }
    );
  };

  const handleViewLocations = async () => {
    setIsFetchingLocations(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/location/all"
      );
      setSavedLocations(response.data);
      console.log("📍 Locations loaded:", response.data);
    } catch (err) {
      console.error("❌ Failed to load locations:", err);
      setError("Failed to load saved locations");
    } finally {
      setIsFetchingLocations(false);
    }
  };

  const clearLocations = () => {
    setSavedLocations([]);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl mt-10">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleGetLocation}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Getting Location...
              </>
            ) : (
              <>
                <FaLocationArrow className="mr-2" />
                Get My Location
              </>
            )}
          </button>

          <button
            onClick={handleViewLocations}
            disabled={isFetchingLocations}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              isFetchingLocations
                ? "bg-purple-400"
                : "bg-purple-600 hover:bg-purple-700"
            } transition-colors`}
          >
            {isFetchingLocations ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <FaDatabase className="mr-2" />
                View Saved Locations
              </>
            )}
          </button>

          {savedLocations.length > 0 && (
            <button
              onClick={clearLocations}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
            >
              Clear Locations
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {location && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-800 mb-2">
              Current Location:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-gray-600">Latitude:</span>
                <p className="font-mono">{location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Longitude:</span>
                <p className="font-mono">{location.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="h-96 w-full rounded-md overflow-hidden shadow-lg">
          <MapContainer
            center={[
              location?.latitude || 20.5937,
              location?.longitude || 78.9629,
            ]}
            zoom={location ? 13 : 5}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {location && (
              <Marker position={[location.latitude, location.longitude]}>
                <Popup className="font-semibold">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-blue-500 mr-1" />
                    <span>You are here</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {savedLocations.map((loc, index) => (
              <Marker
                key={index}
                position={[loc.latitude, loc.longitude]}
                icon={
                  new L.Icon({
                    ...L.Icon.Default.prototype.options,
                    iconUrl: markerIcon,
                    iconRetinaUrl: markerIcon2x,
                    shadowUrl: markerShadow,
                    className: "saved-location-marker",
                  })
                }
              >
                <Popup>
                  <div className="space-y-1">
                    <div className="font-bold text-purple-700">
                      Saved Location #{index + 1}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Lat:</span>{" "}
                      {loc.latitude.toFixed(6)}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Lng:</span>{" "}
                      {loc.longitude.toFixed(6)}
                    </div>
                    {loc.timestamp && (
                      <div className="text-xs text-gray-500">
                        Saved on: {new Date(loc.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {savedLocations.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {savedLocations.length} saved location
            {savedLocations.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLocationMap;
