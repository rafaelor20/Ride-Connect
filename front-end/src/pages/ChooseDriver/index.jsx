import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Clock, 
  Milestone,
  CheckCircle,
  Sparkles
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import StepIndicator from '../../components/UI/StepIndicator';
import Drivers from '../../components/Choose/Drivers';
import RouteMap from '../../components/RouteMap';
import Button from '../../components/Form/Button';

export default function ChooseDriver() {
  const rideEstimateString = localStorage.getItem('rideEstimate');
  const originString = localStorage.getItem('origin');
  const destinationString = localStorage.getItem('destination');

  let rideEstimate = {};
  let origin = '';
  let destination = '';

  try {
    rideEstimate = JSON.parse(rideEstimateString) || {};
    origin = JSON.parse(originString) || '';
    destination = JSON.parse(destinationString) || '';
  } catch (e) {
    console.error('Failed to parse localStorage data in ChooseDriver', e);
  }

  // Calculate human readable duration
  const formatDuration = (seconds) => {
    if (!seconds) return '--';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <AppLayout maxWidth="1200px">
      <StepIndicator currentStep={2} />

      <PageHeader>
        <BackLinkWrap>
          <StyledBackBtn to="/estimate">
            <ArrowLeft size={16} />
            <span>Alterar Trajeto</span>
          </StyledBackBtn>
        </BackLinkWrap>

        <HeaderTitleSection>
          <PageTitle>Selecione seu Motorista</PageTitle>
          <PageSubtitle>Escolha o motorista parceiro de sua preferência para realizar sua viagem.</PageSubtitle>
        </HeaderTitleSection>
      </PageHeader>

      <ChooseGrid>
        {/* Left Column: Route Summary Card & Map */}
        <RouteColumn>
          <RouteSummaryCard>
            <CardHeaderTitle>
              <Milestone size={18} color="var(--color-primary)" />
              <span>Resumo do Percurso</span>
            </CardHeaderTitle>

            <RouteTimeline>
              <TimelineItem>
                <OriginIconDot>
                  <MapPin size={14} color="#ffffff" />
                </OriginIconDot>
                <AddressInfo>
                  <AddressLabel>Ponto de Embarque</AddressLabel>
                  <AddressText>{origin || 'Origem não especificada'}</AddressText>
                </AddressInfo>
              </TimelineItem>

              <TimelineLine />

              <TimelineItem>
                <DestIconDot>
                  <Navigation size={14} color="#ffffff" />
                </DestIconDot>
                <AddressInfo>
                  <AddressLabel>Destino Final</AddressLabel>
                  <AddressText>{destination || 'Destino não especificado'}</AddressText>
                </AddressInfo>
              </TimelineItem>
            </RouteTimeline>

            {/* Distance & Duration Badges */}
            <MetricsRow>
              <MetricBox>
                <MetricIcon>
                  <Milestone size={16} color="var(--color-primary)" />
                </MetricIcon>
                <div>
                  <MetricLabel>Distância Estimada</MetricLabel>
                  <MetricValue>{rideEstimate.distance ? `${rideEstimate.distance} km` : '--'}</MetricValue>
                </div>
              </MetricBox>

              <MetricBox>
                <MetricIcon>
                  <Clock size={16} color="var(--color-secondary)" />
                </MetricIcon>
                <div>
                  <MetricLabel>Tempo Estimado</MetricLabel>
                  <MetricValue>{formatDuration(rideEstimate.duration)}</MetricValue>
                </div>
              </MetricBox>
            </MetricsRow>

            {/* Map Visualizer */}
            <MapWrapper>
              <RouteMap 
                origin={rideEstimate?.origin} 
                destination={rideEstimate?.destination} 
              />
            </MapWrapper>
          </RouteSummaryCard>
        </RouteColumn>

        {/* Right Column: Drivers List */}
        <DriversColumn>
          <Drivers />
        </DriversColumn>
      </ChooseGrid>
    </AppLayout>
  );
}

// Styled Components
const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-out;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
`;

const BackLinkWrap = styled.div`
  display: flex;
`;

const StyledBackBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-lg);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-primary);
    border-color: var(--border-color-focus);
    background-color: var(--color-primary-light);
  }
`;

const HeaderTitleSection = styled.div`
  text-align: left;
`;

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.25rem;

  @media (min-width: 640px) {
    font-size: 1.85rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
`;

const ChooseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;

  @media (min-width: 960px) {
    grid-template-columns: 1.1fr 1fr;
    gap: 2rem;
    align-items: start;
  }
`;

const RouteColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RouteSummaryCard = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CardHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
`;

const RouteTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  z-index: 1;
`;

const OriginIconDot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
`;

const DestIconDot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 13px;
  top: 26px;
  bottom: 26px;
  width: 2px;
  background-color: #cbd5e1;
`;

const AddressInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const AddressLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.04em;
`;

const AddressText = styled.span`
  font-size: 0.925rem;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.4;
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-lg);
  padding: 0.85rem;
  border: 1px solid var(--border-color);
`;

const MetricBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const MetricIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xs);
`;

const MetricLabel = styled.p`
  font-size: 0.725rem;
  color: var(--text-muted);
  margin: 0;
`;

const MetricValue = styled.p`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
`;

const MapWrapper = styled.div`
  width: 100%;
`;

const DriversColumn = styled.div`
  display: flex;
  flex-direction: column;
`;
