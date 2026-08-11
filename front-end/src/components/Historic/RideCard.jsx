import React from 'react';
import styled from 'styled-components';
import { 
  Calendar, 
  MapPin, 
  Navigation, 
  User, 
  Milestone, 
  Clock, 
  CreditCard,
  Filter
} from 'lucide-react';

function formatDate(dateString) {
  if (!dateString) return '--';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '--';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

function formatDuration(seconds) {
  if (!seconds) return '--';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

function formatCurrency(centsOrValue) {
  if (centsOrValue === undefined || centsOrValue === null) return 'R$ 0,00';
  // If value looks like cents (> 100 and an integer), divide by 100, else if float use direct
  const num = typeof centsOrValue === 'number' ? centsOrValue : parseFloat(centsOrValue);
  const val = num > 1000 ? num / 100 : (num > 100 && Number.isInteger(num) ? num / 100 : num);
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function RideCard({ ride, onSelectDriver }) {
  const originAddress = ride.origin?.address || ride.origin || 'Origem';
  const destinationAddress = ride.destination?.address || ride.destination || 'Destino';
  const driverName = ride.driver?.name || ride.driverName || 'Motorista';
  const driverId = ride.driverId || ride.driver?.id;
  const formattedDate = formatDate(ride.createdAt || ride.updatedAt);
  const formattedPrice = formatCurrency(ride.valueInCents !== undefined ? ride.valueInCents : ride.value);

  const handleDriverClick = (e) => {
    if (onSelectDriver && driverId) {
      e.stopPropagation();
      onSelectDriver(driverId, driverName);
    }
  };

  return (
    <CardContainer>
      <CardHeader>
        <DateWrapper>
          <Calendar size={14} color="var(--text-muted)" />
          <span>{formattedDate}</span>
        </DateWrapper>
        <PriceTag>{formattedPrice}</PriceTag>
      </CardHeader>

      {/* Itinerary Timeline */}
      <RouteTimeline>
        <TimelinePoint>
          <OriginDot>
            <MapPin size={12} color="#ffffff" />
          </OriginDot>
          <AddressCol>
            <AddressTag>Origem</AddressTag>
            <AddressValue title={originAddress}>{originAddress}</AddressValue>
          </AddressCol>
        </TimelinePoint>

        <ConnectorLine />

        <TimelinePoint>
          <DestDot>
            <Navigation size={12} color="#ffffff" />
          </DestDot>
          <AddressCol>
            <AddressTag>Destino</AddressTag>
            <AddressValue title={destinationAddress}>{destinationAddress}</AddressValue>
          </AddressCol>
        </TimelinePoint>
      </RouteTimeline>

      {/* Footer Metrics and Driver Badge */}
      <CardFooter>
        <DriverBadge 
          type="button" 
          onClick={handleDriverClick} 
          title="Clique para filtrar apenas viagens com este motorista"
        >
          <User size={13} color="var(--color-primary)" />
          <span>{driverName}</span>
          <Filter size={11} color="var(--text-muted)" />
        </DriverBadge>

        <MetricsGroup>
          <MetricBadge>
            <Milestone size={13} color="var(--text-muted)" />
            <span>{ride.distanceInKm || ride.distance || '--'} km</span>
          </MetricBadge>

          <MetricBadge>
            <Clock size={13} color="var(--text-muted)" />
            <span>{formatDuration(ride.durationInSec || ride.duration)}</span>
          </MetricBadge>
        </MetricsGroup>
      </CardFooter>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--border-color-focus);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: 0.75rem;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const PriceTag = styled.span`
  font-family: var(--font-family-display);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-success);
`;

const RouteTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
  padding-left: 0.25rem;
`;

const TimelinePoint = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  z-index: 1;
`;

const OriginDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  background-color: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DestDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  background: var(--color-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ConnectorLine = styled.div`
  position: absolute;
  left: 11px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background-color: #cbd5e1;
`;

const AddressCol = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AddressTag = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.03em;
`;

const AddressValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-top: 1px solid var(--border-color-light);
  padding-top: 0.75rem;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const DriverBadge = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: 1px solid #c7d2fe;
  border-radius: var(--radius-full);
  padding: 0.25rem 0.65rem;
  font-size: 0.775rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
  width: fit-content;

  &:hover {
    background-color: var(--color-primary);
    color: #ffffff;
    border-color: var(--color-primary);

    svg {
      color: #ffffff !important;
    }
  }
`;

const MetricsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetricBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.775rem;
  color: var(--text-secondary);
  background-color: var(--bg-surface-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
`;
