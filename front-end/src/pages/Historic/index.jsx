import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  History, 
  MapPin, 
  User, 
  Filter, 
  Plus, 
  ArrowLeft, 
  Search, 
  Car,
  X,
  Compass,
  AlertCircle
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import Button from '../../components/Form/Button';
import RideCard from '../../components/Historic/RideCard';
import useGetRidesApi from '../../hooks/api/useGetRides';

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRides() {
      setLoading(true);
      try {
        const data = await getRides({ driver_id: null });
        setRides(data?.rides || []);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Não foi possível carregar o histórico de viagens.');
      } finally {
        setLoading(false);
      }
    }
    fetchRides();
  }, []);

  // Extract unique drivers from rides list
  const uniqueDrivers = useMemo(() => {
    const driversMap = new Map();
    rides.forEach((r) => {
      const id = r.driverId || r.driver?.id;
      const name = r.driver?.name || r.driverName;
      if (id && name && !driversMap.has(id)) {
        driversMap.set(id, { id, name });
      }
    });
    return Array.from(driversMap.values());
  }, [rides]);

  // Filter rides by driver and text query
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      // Driver filter
      const rideDriverId = ride.driverId || ride.driver?.id;
      if (selectedDriverId && String(rideDriverId) !== String(selectedDriverId)) {
        return false;
      }

      // Search query filter (origin, destination, driver name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const origin = (ride.origin?.address || '').toLowerCase();
        const dest = (ride.destination?.address || '').toLowerCase();
        const driverName = (ride.driver?.name || '').toLowerCase();
        return origin.includes(query) || dest.includes(query) || driverName.includes(query);
      }

      return true;
    });
  }, [rides, selectedDriverId, searchQuery]);

  const handleSelectDriverFilter = (driverId, driverName) => {
    setSelectedDriverId(driverId);
    toast.info(`Filtrando viagens com ${driverName}`);
  };

  const handleClearFilters = () => {
    setSelectedDriverId('');
    setSearchQuery('');
  };

  return (
    <AppLayout maxWidth="1100px">
      <PageHeader>
        <HeaderLeft>
          <PageBadge>
            <History size={15} />
            <span>Suas Viagens</span>
          </PageBadge>
          <PageTitle>Histórico de Viagens</PageTitle>
          <PageSubtitle>
            Visualize todas as suas viagens realizadas, filtre por motorista ou busque por endereço.
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

      {/* Filter and Search Bar */}
      <FilterToolbar>
        {/* Search input */}
        <SearchBox>
          <Search size={18} color="var(--text-muted)" />
          <SearchInput
            type="text"
            placeholder="Buscar por endereço ou motorista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ClearSearchBtn onClick={() => setSearchQuery('')} title="Limpar busca">
              <X size={15} />
            </ClearSearchBtn>
          )}
        </SearchBox>

        {/* Driver Filter Dropdown */}
        <DriverFilterBox>
          <FilterIconWrapper>
            <Filter size={16} color="var(--color-primary)" />
          </FilterIconWrapper>
          <StyledDriverSelect
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
          >
            <option value="">Todos os motoristas ({uniqueDrivers.length})</option>
            {uniqueDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </StyledDriverSelect>
        </DriverFilterBox>
      </FilterToolbar>

      {/* Filter status & active tags */}
      {(selectedDriverId || searchQuery) && (
        <ActiveFilterBar>
          <FilterActiveLabel>Filtros ativos:</FilterActiveLabel>
          {selectedDriverId && (
            <ActiveChip>
              <span>Motorista: {uniqueDrivers.find((d) => String(d.id) === String(selectedDriverId))?.name || selectedDriverId}</span>
              <button onClick={() => setSelectedDriverId('')} title="Remover filtro de motorista">
                <X size={13} />
              </button>
            </ActiveChip>
          )}
          {searchQuery && (
            <ActiveChip>
              <span>Busca: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} title="Remover busca">
                <X size={13} />
              </button>
            </ActiveChip>
          )}
          <ResetFiltersBtn onClick={handleClearFilters}>
            Limpar todos
          </ResetFiltersBtn>
        </ActiveFilterBar>
      )}

      {/* Main Content Area */}
      {loading ? (
        <LoadingState>
          <LoadingSpinner />
          <p>Carregando seu histórico de viagens...</p>
        </LoadingState>
      ) : filteredRides.length > 0 ? (
        <RidesSection>
          <ResultsMeta>
            <span>Exibindo <strong>{filteredRides.length}</strong> {filteredRides.length === 1 ? 'viagem' : 'viagens'}</span>
          </ResultsMeta>

          <RidesGrid>
            {filteredRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onSelectDriver={handleSelectDriverFilter}
              />
            ))}
          </RidesGrid>
        </RidesSection>
      ) : (
        <EmptyStateCard>
          <EmptyIconWrapper>
            {rides.length === 0 ? <Compass size={40} color="var(--color-primary)" /> : <Search size={40} color="var(--text-muted)" />}
          </EmptyIconWrapper>
          <EmptyTitle>
            {rides.length === 0 ? 'Nenhuma viagem realizada ainda' : 'Nenhuma viagem encontrada com estes filtros'}
          </EmptyTitle>
          <EmptyDesc>
            {rides.length === 0 
              ? 'Você ainda não realizou nenhuma viagem pelo Ride Connect. Solicite sua primeira corrida agora mesmo!'
              : 'Tente alterar os termos da busca ou selecionar outro motorista.'}
          </EmptyDesc>
          {rides.length === 0 ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              icon={Plus}
              onClick={() => navigate('/estimate')}
            >
              Solicitar Primeira Viagem
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClearFilters}
            >
              Limpar Filtros
            </Button>
          )}
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
  margin-bottom: 1.75rem;
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

const FilterToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 0.85rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.5rem 0.85rem;
  flex: 1;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: var(--text-main);

  &::placeholder {
    color: var(--text-light);
  }
`;

const ClearSearchBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;

  &:hover {
    color: var(--text-main);
  }
`;

const DriverFilterBox = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0 0.75rem;

  @media (min-width: 768px) {
    width: 280px;
  }
`;

const FilterIconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.4rem;
`;

const StyledDriverSelect = styled.select`
  flex: 1;
  padding: 0.6rem 0;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  outline: none;
`;

const ActiveFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0 0.25rem;
`;

const FilterActiveLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
`;

const ActiveChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: 1px solid #c7d2fe;
  border-radius: var(--radius-full);
  padding: 0.25rem 0.65rem;
  font-size: 0.775rem;
  font-weight: 600;

  button {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    padding: 0;

    &:hover {
      color: var(--color-danger);
    }
  }
`;

const ResetFiltersBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: var(--color-danger);
  }
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
  margin-top: 1rem;
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