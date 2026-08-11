import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  User, 
  ArrowLeft, 
  History, 
  Plus, 
  Car, 
  Compass, 
  Filter,
  CheckCircle2
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import Button from '../../components/Form/Button';
import RideCard from '../../components/Historic/RideCard';
import useGetRidesApi from '../../hooks/api/useGetRides';

export default function HistoricByDriver() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const driverId = JSON.parse(localStorage.getItem('driverId')) || null;

  useEffect(() => {
    async function fetchRides() {
      setLoading(true);
      try {
        const data = await getRides({ driver_id: driverId });
        setRides(data?.rides || []);
      } catch (error) {
        console.error('Error fetching rides by driver:', error);
        toast.error('Não foi possível carregar as viagens deste motorista.');
      } finally {
        setLoading(false);
      }
    }
    fetchRides();
  }, [driverId]);

  const driverName = rides.length > 0 ? (rides[0].driver?.name || 'Motorista Selecionado') : 'Motorista';

  return (
    <AppLayout maxWidth="1100px">
      <PageHeader>
        <HeaderLeft>
          <BackBtnWrapper>
            <StyledBackLink to="/rides">
              <ArrowLeft size={16} />
              <span>Ver todas as viagens</span>
            </StyledBackLink>
          </BackBtnWrapper>

          <PageBadge>
            <Filter size={14} />
            <span>Filtro por Motorista Parceiro</span>
          </PageBadge>
          <PageTitle>
            Viagens com <span>{driverName}</span>
          </PageTitle>
          <PageSubtitle>
            Exibindo apenas as corridas realizadas com este motorista parceiro.
          </PageSubtitle>
        </HeaderLeft>

        <HeaderRight>
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/estimate')}
          >
            Nova Viagem
          </Button>
        </HeaderRight>
      </PageHeader>

      {/* Main Content */}
      {loading ? (
        <LoadingState>
          <LoadingSpinner />
          <p>Carregando histórico do motorista...</p>
        </LoadingState>
      ) : rides.length > 0 ? (
        <RidesSection>
          <ResultsMeta>
            <span>Total de <strong>{rides.length}</strong> {rides.length === 1 ? 'viagem encontrada' : 'viagens encontradas'}</span>
          </ResultsMeta>

          <RidesGrid>
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </RidesGrid>
        </RidesSection>
      ) : (
        <EmptyStateCard>
          <EmptyIconWrapper>
            <User size={40} color="var(--text-muted)" />
          </EmptyIconWrapper>
          <EmptyTitle>Nenhuma viagem encontrada com este motorista</EmptyTitle>
          <EmptyDesc>
            Não constam viagens registradas com este motorista parceiro no momento.
          </EmptyDesc>
          <ButtonsRow>
            <Button
              type="button"
              variant="secondary"
              size="md"
              icon={ArrowLeft}
              onClick={() => navigate('/rides')}
            >
              Voltar para Todas as Viagens
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => navigate('/estimate')}
            >
              Solicitar Nova Viagem
            </Button>
          </ButtonsRow>
        </EmptyStateCard>
      )}
    </AppLayout>
  );
}

// Styled Components
const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease-out;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const BackBtnWrapper = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledBackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
`;

const PageBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: 0.775rem;
  font-weight: 700;
  width: fit-content;
  margin-bottom: 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.35rem;

  span {
    color: var(--color-primary);
  }

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 580px;
  margin: 0;
`;

const RidesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResultsMeta = styled.div`
  font-size: 0.875rem;
  color: var(--text-muted);
  padding: 0 0.25rem;

  strong {
    color: var(--text-main);
  }
`;

const RidesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  gap: 1rem;
  color: var(--text-muted);
`;

const LoadingSpinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
`;

const EmptyStateCard = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 3rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-sm);
`;

const EmptyIconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.4rem;
`;

const EmptyDesc = styled.p`
  font-size: 0.925rem;
  color: var(--text-muted);
  max-width: 440px;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;