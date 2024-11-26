import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

const RouteMap = (props) => {
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const origin = { lat: props.origin.latitude, lng: props.origin.longitude };
  const destination = { lat: props.destination.latitude, lng: props.destination.longitude };

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
      googleMapsApiKey="AIzaSyDh52-Xri7BdhGoLqaBIOiEmVel0scIa3Y"
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
