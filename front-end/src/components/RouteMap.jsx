import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import styled from 'styled-components';

const RouteMap = (props) => {
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const originLat = props.origin?.latitude;
  const originLng = props.origin?.longitude;
  const destinationLat = props.destination?.latitude;
  const destinationLng = props.destination?.longitude;

  useEffect(() => {
    if (!mapLoaded || !originLat || !originLng || !destinationLat || !destinationLng) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: originLat, lng: originLng },
        destination: { lat: destinationLat, lng: destinationLng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [mapLoaded, originLat, originLng, destinationLat, destinationLng]);

  return (
    <MapContainer>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_API_GOOGLE_API_KEY}
      onLoad={() => setMapLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={{ width: '300px', height: '300px' }}
        center={{ lat: originLat, lng: originLng }}
        zoom={13}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
    </MapContainer>
  );
};

export default RouteMap;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;
  border-radius: 8px;
  overflow: auto;
`;
