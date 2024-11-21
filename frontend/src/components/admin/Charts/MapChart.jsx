import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";

const MapChart = ({ data, formatDate }) => {
  console.log(data, "location data");

  const markers = data
    .filter((location) => location.value.location)
    .map((location) => ({
      lat: location.value.location.latitude,
      lng: location.value.location.longitude,
      content: formatDate(location.createdAt),
    }));

  return (
    <MapContainer
      center={[23.25, 77.41]}
      zoom={5}
      maxZoom={15}
      style={{ height: "460px", width: "100%", borderRadius: "3%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* 
      <MarkerClusterGroup showCoverageOnHover={false}> */}
      {/* <MarkerClusterGroup> */}
      {markers.map((marker, index) => (
        <CircleMarker
          key={index}
          center={[marker.lat, marker.lng]}
          radius={6}
          color="purple"
          fillOpacity={1}
        >
          <Popup>{marker.content}</Popup>
        </CircleMarker>
      ))}
      {/* </MarkerClusterGroup> */}
    </MapContainer>
  );
};

export default MapChart;
