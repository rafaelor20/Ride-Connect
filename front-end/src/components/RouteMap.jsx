import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import styled from 'styled-components';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

const RouteMap = ({ origin, destination }) => {
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const originLat = origin?.latitude;
  const originLng = origin?.longitude;
  const destinationLat = destination?.latitude;
  const destinationLng = destination?.longitude;

  const apiKey = import.meta.env.VITE_API_GOOGLE_API_KEY || '';

  useEffect(() => {
    if (!mapLoaded || !window.google || !originLat || !originLng || !destinationLat || !destinationLng) return;

    try {
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
            console.warn(`Error fetching directions: ${status}`);
          }
        }
      );
    } catch (err) {
      console.warn('Google Maps route calculation error:', err);
    }
  }, [mapLoaded, originLat, originLng, destinationLat, destinationLng]);

  if (!apiKey) {
    return (
      <MapFallback>
        <MapFallbackIconWrapper>
          <Navigation size={32} color="var(--color-primary)" />
        </MapFallbackIconWrapper>
        <MapFallbackTitle>Visualização da Rota</MapFallbackTitle>
        <MapFallbackDesc>
          Origem e destino definidos com sucesso. A rota estimada está pronta para navegação.
        </MapFallbackDesc>
      </MapFallback>
    );
  }

  return (
    <MapContainer>
      <LoadScript
        googleMapsApiKey={apiKey}
        onLoad={() => setMapLoaded(true)}
        onError={() => setLoadError(true)}
      >
        {loadError ? (
          <MapFallback>
            <AlertCircle size={32} color="var(--color-warning)" />
            <MapFallbackTitle>Mapa Temporariamente Indisponível</MapFallbackTitle>
            <MapFallbackDesc>Não foi possível carregar os dados do mapa, mas você pode continuar sua solicitação normalmente.</MapFallbackDesc>
          </MapFallback>
        ) : (
          <GoogleMap
            mapContainerStyle={{ 
              width: '100%', 
              height: '100%',
              minHeight: '280px',
              borderRadius: 'var(--radius-xl)'
            }}
            center={{ lat: originLat || -23.5505, lng: originLng || -46.6333 }}
            zoom={13}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        )}
      </LoadScript>
    </MapContainer>
  );
};

export default RouteMap;

const MapContainer = styled.div`
  width: 100%;
  height: 320px;
  max-height: 420px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  position: relative;
  background-color: var(--bg-surface-secondary);

  @media (min-width: 768px) {
    height: 380px;
  }
`;

const MapFallback = styled.div`
  width: 100%;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-gradient-subtle);
  border: 1.5px dashed var(--border-color-focus);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  text-align: center;
  box-sizing: border-box;

  @media (min-width: 768px) {
    height: 340px;
  }
`;

const MapFallbackIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  margin-bottom: 0.75rem;
`;

const MapFallbackTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.35rem;
`;

const MapFallbackDesc = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  max-width: 320px;
  margin: 0;
`;
