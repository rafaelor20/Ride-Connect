import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Car, 
  User, 
  Clock, 
  Milestone, 
  CreditCard,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import StepIndicator from '../../components/UI/StepIndicator';
import Button from '../../components/Form/Button';
import useConfirm from '../../hooks/api/useConfirm';

export default function ConfirmRide() {
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate')) || {};
  const rideConfirm = JSON.parse(localStorage.getItem('rideConfirm')) || {};
  const origin = JSON.parse(localStorage.getItem('origin')) || '';
  const destination = JSON.parse(localStorage.getItem('destination')) || '';
  
  const navigate = useNavigate();
  const { confirmLoading, confirm } = useConfirm();

  const formattedPrice = Number(rideConfirm.value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const formatDuration = (seconds) => {
    if (!seconds) return '--';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  async function submit(event) {
    if (event) event.preventDefault();
    try {
      await confirm({ 
        origin: origin, 
        destination: destination, 
        distance: rideEstimate.distance, 
        duration: rideEstimate.duration, 
        driver: { id: rideConfirm.id, name: rideConfirm.name },
        value: rideConfirm.value 
      });
      
      toast.success('Viagem confirmada com sucesso!');
      
      // Clear ride booking cache from localStorage
      localStorage.removeItem('rideEstimate');
      localStorage.removeItem('rideConfirm');
      localStorage.removeItem('origin');
      localStorage.removeItem('destination');
      
      navigate('/home');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Erro ao confirmar viagem';
      toast.error(`Falha ao confirmar: ${msg}`);
      navigate('/choose-driver');
    }
  }

  return (
    <AppLayout maxWidth="760px">
      <StepIndicator currentStep={3} />

      <PageHeading>
        <PageTitle>Quase tudo pronto!</PageTitle>
        <PageSubtitle>Revise os detalhes do percurso e do motorista parceiro antes de confirmar a solicitação.</PageSubtitle>
      </PageHeading>

      <ConfirmCard>
        {/* Route Details Box */}
        <SectionBlock>
          <SectionTitle>
            <Milestone size={18} color="var(--color-primary)" />
            <span>Itinerário da Viagem</span>
          </SectionTitle>

          <RouteTimeline>
            <TimelineItem>
              <OriginIconDot>
                <MapPin size={14} color="#ffffff" />
              </OriginIconDot>
              <AddressInfo>
                <AddressLabel>Local de Partida (Origem)</AddressLabel>
                <AddressText>{origin || 'Origem não informada'}</AddressText>
              </AddressInfo>
            </TimelineItem>

            <TimelineLine />

            <TimelineItem>
              <DestIconDot>
                <Navigation size={14} color="#ffffff" />
              </DestIconDot>
              <AddressInfo>
                <AddressLabel>Local de Chegada (Destino)</AddressLabel>
                <AddressText>{destination || 'Destino não informado'}</AddressText>
              </AddressInfo>
            </TimelineItem>
          </RouteTimeline>

          {/* Quick Metrics */}
          <MetricsRow>
            <MetricItem>
              <Milestone size={16} color="var(--color-primary)" />
              <div>
                <MetricLabel>Distância</MetricLabel>
                <MetricValue>{rideEstimate.distance ? `${rideEstimate.distance} km` : '--'}</MetricValue>
              </div>
            </MetricItem>
            <MetricItem>
              <Clock size={16} color="var(--color-secondary)" />
              <div>
                <MetricLabel>Tempo Estimado</MetricLabel>
                <MetricValue>{formatDuration(rideEstimate.duration)}</MetricValue>
              </div>
            </MetricItem>
          </MetricsRow>
        </SectionBlock>

        <Divider />

        {/* Selected Driver Box */}
        <SectionBlock>
          <SectionTitle>
            <User size={18} color="var(--color-primary)" />
            <span>Motorista Selecionado</span>
          </SectionTitle>

          <DriverSummaryBox>
            <DriverProfileRow>
              <AvatarBox>
                <User size={24} color="var(--color-primary)" />
              </AvatarBox>
              <DriverInfoCol>
                <DriverNameText>{rideConfirm.name || 'Motorista'}</DriverNameText>
                <VehicleTag>
                  <Car size={13} />
                  <span>{rideConfirm.vehicle || 'Veículo Padrão'}</span>
                </VehicleTag>
              </DriverInfoCol>
            </DriverProfileRow>
          </DriverSummaryBox>
        </SectionBlock>

        {/* Total Price Card */}
        <TotalFareBox>
          <FareLabelWrap>
            <CreditCard size={18} color="var(--color-success)" />
            <div>
              <FareTitle>Valor Total da Corrida</FareTitle>
              <FareSubtitle>Pagamento calculado com base no trajeto</FareSubtitle>
            </div>
          </FareLabelWrap>
          <FareAmount>{formattedPrice}</FareAmount>
        </TotalFareBox>

        {/* Action Buttons */}
        <ActionsContainer>
          <Button
            type="button"
            variant="success"
            size="lg"
            fullWidth
            loading={confirmLoading}
            onClick={submit}
            icon={CheckCircle2}
          >
            Confirmar e Chamar Motorista
          </Button>

          <SecondaryButtonsGrid>
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              disabled={confirmLoading}
              onClick={() => navigate('/choose-driver')}
              icon={ArrowLeft}
            >
              Trocar Motorista
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              disabled={confirmLoading}
              onClick={() => navigate('/estimate')}
              icon={RotateCcw}
            >
              Alterar Trajeto
            </Button>
          </SecondaryButtonsGrid>
        </ActionsContainer>

        <FooterHomeLink>
          <StyledHomeLink to="/home">
            <span>Cancelar e voltar ao painel principal</span>
          </StyledHomeLink>
        </FooterHomeLink>
      </ConfirmCard>
    </AppLayout>
  );
}

// Styled Components
const PageHeading = styled.div`
  text-align: center;
  margin-bottom: 1.75rem;
  animation: fadeIn 0.3s ease-out;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.35rem;

  @media (min-width: 640px) {
    font-size: 2.1rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto;
`;

const ConfirmCard = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.75rem 1.25rem;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.3s ease-out;

  @media (min-width: 640px) {
    padding: 2.25rem 2rem;
  }
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
`;

const RouteTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-lg);
  padding: 1rem;
  border: 1px solid var(--border-color);
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
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 23px;
  top: 36px;
  bottom: 36px;
  width: 2px;
  background-color: #cbd5e1;
`;

const AddressInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const AddressLabel = styled.span`
  font-size: 0.725rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const AddressText = styled.span`
  font-size: 0.925rem;
  font-weight: 600;
  color: var(--text-main);
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  border: 1px solid var(--border-color);
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

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--border-color);
`;

const DriverSummaryBox = styled.div`
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-lg);
  padding: 1rem;
  border: 1px solid var(--border-color);
`;

const DriverProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AvatarBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #c7d2fe;
`;

const DriverInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DriverNameText = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
`;

const VehicleTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.775rem;
  font-weight: 600;
  color: var(--text-secondary);
  background-color: #ffffff;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  width: fit-content;
`;

const TotalFareBox = styled.div`
  background: var(--color-primary-gradient-subtle);
  border: 1.5px solid var(--color-success-border);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    flex-direction: row;
    padding: 1.25rem 1.5rem;
  }
`;

const FareLabelWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FareTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
`;

const FareSubtitle = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
`;

const FareAmount = styled.span`
  font-family: var(--font-family-display);
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--color-success);
  letter-spacing: -0.02em;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.5rem;
`;

const SecondaryButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FooterHomeLink = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--border-color-light);
  padding-top: 1rem;
`;

const StyledHomeLink = styled(Link)`
  font-size: 0.875rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: var(--color-danger);
    text-decoration: underline;
  }
`;