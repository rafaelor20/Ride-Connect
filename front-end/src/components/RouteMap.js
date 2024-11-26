import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

const RouteMap = (props) => {
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const googleMapsApiKey = process.env.GOOGLE_API;
  console.log(googleMapsApiKey);
  /*
  const origin = { lat: -10.9263351, lng: -37.1030664 }; // Origem
  const destination = { lat: -10.9688219, lng: -37.0579397 }; // Destino
  */
  const origin = { lat: props.origin.latitude, lng: props.origin.longitude };
  const destination = { lat: props.destination.latitude, lng: props.destination.longitude };
  console.log(origin);
  console.log(destination);

  useEffect(() => {
    if (!mapLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
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
  }, [mapLoaded]);

  return (
    <LoadScript
      googleMapsApiKey="SUA_CHAVE_DE_API"
      onLoad={() => setMapLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={origin}
        zoom={13}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
