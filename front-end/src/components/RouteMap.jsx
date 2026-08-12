import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { Navigation, AlertCircle } from 'lucide-react';

const RouteMap = ({ origin, destination }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  const originLat = origin?.latitude;
  const originLng = origin?.longitude;
  const destinationLat = destination?.latitude;
  const destinationLng = destination?.longitude;

  const hasValidCoordinates =
    typeof originLat === 'number' &&
    typeof originLng === 'number' &&
    typeof destinationLat === 'number' &&
    typeof destinationLng === 'number';

  useEffect(() => {
    if (!hasValidCoordinates || !mapContainerRef.current) return;

    // Clean up any existing map instance before re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // 1. Initialize Leaflet map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      // Add zoom control in top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // 2. Add CartoDB Voyager tiles (Clean, modern and free)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // 3. Custom Marker Icons
      const createCustomIcon = (bgColor, labelText) => {
        return L.divIcon({
          className: 'rc-custom-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              background-color: ${bgColor};
              color: #ffffff;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              border: 2.5px solid #ffffff;
              font-weight: 700;
              font-size: 11px;
              font-family: sans-serif;
            ">
              ${labelText}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });
      };

      const originIcon = createCustomIcon('#10b981', 'A');
      const destIcon = createCustomIcon('#6366f1', 'B');

      // Add markers
      const originMarker = L.marker([originLat, originLng], { icon: originIcon }).addTo(map);
      originMarker.bindPopup('<strong>Origem (Embarque)</strong>');

      const destMarker = L.marker([destinationLat, destinationLng], { icon: destIcon }).addTo(map);
      destMarker.bindPopup('<strong>Destino</strong>');

      // 4. Trace driving route via OSRM (Free open-source routing)
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destinationLng},${destinationLat}?overview=full&geometries=geojson`;

      const drawFallbackLine = () => {
        if (!mapInstanceRef.current) return;
        L.polyline(
          [
            [originLat, originLng],
            [destinationLat, destinationLng],
          ],
          {
            color: '#6366f1',
            weight: 4,
            dashArray: '6, 8',
            opacity: 0.85,
          }
        ).addTo(map);
      };

      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (!mapInstanceRef.current) return;

          if (data.routes && data.routes.length > 0 && data.routes[0].geometry) {
            // Glow line behind
            L.geoJSON(data.routes[0].geometry, {
              style: {
                color: '#6366f1',
                weight: 8,
                opacity: 0.25,
                lineCap: 'round',
                lineJoin: 'round',
              },
            }).addTo(map);

            // Main route line
            L.geoJSON(data.routes[0].geometry, {
              style: {
                color: '#4f46e5',
                weight: 4.5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
              },
            }).addTo(map);
          } else {
            drawFallbackLine();
          }
        })
        .catch((err) => {
          console.warn('Could not fetch OSRM route, falling back to direct polyline:', err);
          drawFallbackLine();
        });

      // 5. Fit bounds to nicely frame origin and destination
      const bounds = L.latLngBounds(
        [originLat, originLng],
        [destinationLat, destinationLng]
      );
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
      });
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
      setLoadError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [originLat, originLng, destinationLat, destinationLng, hasValidCoordinates]);

  if (!hasValidCoordinates) {
    return (
      <MapFallback>
        <MapFallbackIconWrapper>
          <Navigation size={32} color="var(--color-primary)" />
        </MapFallbackIconWrapper>
        <MapFallbackTitle>Visualização da Rota</MapFallbackTitle>
        <MapFallbackDesc>
          Defina a origem e o destino para visualizar o mapa do trajeto em tempo real.
        </MapFallbackDesc>
      </MapFallback>
    );
  }

  if (loadError) {
    return (
      <MapFallback>
        <AlertCircle size={32} color="var(--color-warning)" />
        <MapFallbackTitle>Mapa Temporariamente Indisponível</MapFallbackTitle>
        <MapFallbackDesc>
          Não foi possível carregar os dados do mapa, mas você pode continuar sua solicitação normalmente.
        </MapFallbackDesc>
      </MapFallback>
    );
  }

  return (
    <MapContainer>
      <MapElement ref={mapContainerRef} />
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

  /* Ensure Leaflet controls stay within border radius */
  .leaflet-container {
    width: 100%;
    height: 100%;
    font-family: inherit;
  }

  .leaflet-touch .leaflet-control-layers,
  .leaflet-touch .leaflet-bar {
    border: none;
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    background-color: #ffffff !important;
    color: var(--text-main) !important;
    border: 1px solid var(--border-color) !important;
  }
`;

const MapElement = styled.div`
  width: 100%;
  height: 100%;
  min-height: 280px;
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
