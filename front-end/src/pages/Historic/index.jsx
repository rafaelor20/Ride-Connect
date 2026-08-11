import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  History, 
  MapPin, 
  User, 
  Filter, 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  X,
  Compass,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import Button from '../../components/Form/Button';
import RideCard from '../../components/Historic/RideCard';
import useGetRidesApi from '../../hooks/api/useGetRides';

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilterMode, setDateFilterMode] = useState('all'); // 'all', 'today', '7days', '30days', 'this_month', 'custom_single', 'custom_range'
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  // Helper to get local date string YYYY-MM-DD from a date/timestamp
  const getLocalDateString = (dateObj) => {
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter rides by driver, date, and text query
  const filteredRides = useMemo(() => {
    const now = new Date();
    const todayStr = getLocalDateString(now);

    return rides.filter((ride) => {
      // 1. Driver filter
      const rideDriverId = ride.driverId || ride.driver?.id;
      if (selectedDriverId && String(rideDriverId) !== String(selectedDriverId)) {
        return false;
      }

      // 2. Date Filter
      const rideDateStr = getLocalDateString(ride.createdAt || ride.updatedAt);
      const rideTimestamp = new Date(ride.createdAt || ride.updatedAt).getTime();

      if (dateFilterMode === 'today') {
        if (rideDateStr !== todayStr) return false;
      } else if (dateFilterMode === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        if (rideTimestamp < sevenDaysAgo.getTime()) return false;
      } else if (dateFilterMode === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        if (rideTimestamp < thirtyDaysAgo.getTime()) return false;
      } else if (dateFilterMode === 'this_month') {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        if (rideTimestamp < firstDayOfMonth) return false;
      } else if (dateFilterMode === 'custom_single') {
        if (singleDate && rideDateStr !== singleDate) return false;
      } else if (dateFilterMode === 'custom_range') {
        if (startDate && rideDateStr < startDate) return false;
        if (endDate && rideDateStr > endDate) return false;
      }

      // 3. Search query filter (origin, destination, driver name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const origin = (ride.origin?.address || '').toLowerCase();
        const dest = (ride.destination?.address || '').toLowerCase();
        const driverName = (ride.driver?.name || '').toLowerCase();
        return origin.includes(query) || dest.includes(query) || driverName.includes(query);
      }

      return true;
    });
  }, [rides, selectedDriverId, dateFilterMode, singleDate, startDate, endDate, searchQuery]);

  const handleSelectDriverFilter = (driverId, driverName) => {
    setSelectedDriverId(driverId);
    toast.info(`Filtrando viagens com ${driverName}`);
  };

  const handleClearAllFilters = () => {
    setSelectedDriverId('');
    setSearchQuery('');
    setDateFilterMode('all');
    setSingleDate('');
    setStartDate('');
    setEndDate('');
  };

  // Human label for active date filter
  const getDateFilterLabel = () => {
    switch (dateFilterMode) {
      case 'today':
        return 'Hoje';
      case '7days':
        return 'Últimos 7 dias';
      case '30days':
        return 'Últimos 30 dias';
      case 'this_month':
        return 'Este mês';
      case 'custom_single': {
        if (!singleDate) return 'Data específica';
        const [sy, sm, sd] = singleDate.split('-');
        return `Data: ${sd}/${sm}/${sy}`;
      }
      case 'custom_range': {
        if (!startDate && !endDate) return 'Período';
        const formatBR = (iso) => {
          if (!iso) return '...';
          const [y, m, d] = iso.split('-');
          return `${d}/${m}/${y}`;
        };
        return `Período: ${formatBR(startDate)} até ${formatBR(endDate)}`;
      }
      default:
        return null;
    }
  };

  const isAnyFilterActive = selectedDriverId || searchQuery || dateFilterMode !== 'all';

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
            Visualize todas as suas viagens realizadas, filtre por data, motorista ou endereço.
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

      {/* Main Filter Section */}
      <FilterSectionWrapper>
        {/* Top Controls: Search + Driver Select */}
        <PrimaryFiltersRow>
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
              <User size={16} color="var(--color-primary)" />
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
        </PrimaryFiltersRow>

        {/* Date Filter Toolbar & Presets */}
        <DateFilterContainer>
          <DateFilterHeader>
            <DateFilterTitleWrap>
              <CalendarIcon size={16} color="var(--color-primary)" />
              <span>Filtrar por Data:</span>
            </DateFilterTitleWrap>

            <DatePresetsRow>
              <PresetButton 
                $active={dateFilterMode === 'all'} 
                onClick={() => setDateFilterMode('all')}
              >
                Todas
              </PresetButton>
              <PresetButton 
                $active={dateFilterMode === 'today'} 
                onClick={() => setDateFilterMode('today')}
              >
                Hoje
              </PresetButton>
              <PresetButton 
                $active={dateFilterMode === '7days'} 
                onClick={() => setDateFilterMode('7days')}
              >
                Últimos 7 dias
              </PresetButton>
              <PresetButton 
                $active={dateFilterMode === 'this_month'} 
                onClick={() => setDateFilterMode('this_month')}
              >
                Este mês
              </PresetButton>
              <PresetButton 
                $active={dateFilterMode === '30days'} 
                onClick={() => setDateFilterMode('30days')}
              >
                Últimos 30 dias
              </PresetButton>
              <PresetButton 
                $active={dateFilterMode === 'custom_single'} 
                onClick={() => setDateFilterMode('custom_single')}
              >
                Data Específica
              </PresetButton>
              <PresetButton 
                $active={dateFilterMode === 'custom_range'} 
                onClick={() => setDateFilterMode('custom_range')}
              >
                Intervalo de Datas
              </PresetButton>
            </DatePresetsRow>
          </DateFilterHeader>

          {/* Conditional Date Pickers based on active mode */}
          {dateFilterMode === 'custom_single' && (
            <DatePickerBox>
              <DateInputLabel>
                <span>Selecione o dia da viagem:</span>
              </DateInputLabel>
              <DateInputWrapper>
                <CalendarIcon size={16} color="var(--text-muted)" />
                <StyledDateInput
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                />
                {singleDate && (
                  <ClearDateBtn onClick={() => setSingleDate('')} title="Limpar data">
                    <X size={14} />
                  </ClearDateBtn>
                )}
              </DateInputWrapper>
            </DatePickerBox>
          )}

          {dateFilterMode === 'custom_range' && (
            <DateRangeBox>
              <RangeFieldCol>
                <DateInputLabel>Data Inicial (De):</DateInputLabel>
                <DateInputWrapper>
                  <CalendarIcon size={16} color="var(--text-muted)" />
                  <StyledDateInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  {startDate && (
                    <ClearDateBtn onClick={() => setStartDate('')} title="Limpar data inicial">
                      <X size={14} />
                    </ClearDateBtn>
                  )}
                </DateInputWrapper>
              </RangeFieldCol>

              <RangeFieldCol>
                <DateInputLabel>Data Final (Até):</DateInputLabel>
                <DateInputWrapper>
                  <CalendarIcon size={16} color="var(--text-muted)" />
                  <StyledDateInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {endDate && (
                    <ClearDateBtn onClick={() => setEndDate('')} title="Limpar data final">
                      <X size={14} />
                    </ClearDateBtn>
                  )}
                </DateInputWrapper>
              </RangeFieldCol>
            </DateRangeBox>
          )}
        </DateFilterContainer>
      </FilterSectionWrapper>

      {/* Active Filter Chips Bar */}
      {isAnyFilterActive && (
        <ActiveFilterBar>
          <FilterActiveLabel>Filtros ativos:</FilterActiveLabel>

          {dateFilterMode !== 'all' && (
            <ActiveChip>
              <CalendarIcon size={13} />
              <span>{getDateFilterLabel()}</span>
              <button 
                onClick={() => {
                  setDateFilterMode('all');
                  setSingleDate('');
                  setStartDate('');
                  setEndDate('');
                }} 
                title="Remover filtro de data"
              >
                <X size={13} />
              </button>
            </ActiveChip>
          )}

          {selectedDriverId && (
            <ActiveChip>
              <User size={13} />
              <span>Motorista: {uniqueDrivers.find((d) => String(d.id) === String(selectedDriverId))?.name || selectedDriverId}</span>
              <button onClick={() => setSelectedDriverId('')} title="Remover filtro de motorista">
                <X size={13} />
              </button>
            </ActiveChip>
          )}

          {searchQuery && (
            <ActiveChip>
              <Search size={13} />
              <span>Busca: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} title="Remover busca">
                <X size={13} />
              </button>
            </ActiveChip>
          )}

          <ResetFiltersBtn onClick={handleClearAllFilters}>
            <RotateCcw size={13} />
            <span>Limpar todos</span>
          </ResetFiltersBtn>
        </ActiveFilterBar>
      )}

      {/* Results Content */}
      {loading ? (
        <LoadingState>
          <LoadingSpinner />
          <p>Carregando seu histórico de viagens...</p>
        </LoadingState>
      ) : filteredRides.length > 0 ? (
        <RidesSection>
          <ResultsMeta>
            <span>
              Exibindo <strong>{filteredRides.length}</strong> {filteredRides.length === 1 ? 'viagem' : 'viagens'}
              {rides.length !== filteredRides.length && ` de um total de ${rides.length}`}
            </span>
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
            {rides.length === 0 ? (
              <Compass size={40} color="var(--color-primary)" />
            ) : (
              <CalendarIcon size={40} color="var(--text-muted)" />
            )}
          </EmptyIconWrapper>
          <EmptyTitle>
            {rides.length === 0 
              ? 'Nenhuma viagem realizada ainda' 
              : 'Nenhuma viagem encontrada com os filtros selecionados'}
          </EmptyTitle>
          <EmptyDesc>
            {rides.length === 0 
              ? 'Você ainda não realizou nenhuma viagem pelo Ride Connect. Solicite sua primeira corrida agora mesmo!'
              : 'Tente alterar o período de data selecionado, remover o filtro de motorista ou limpar os termos de busca.'}
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
              icon={RotateCcw}
              onClick={handleClearAllFilters}
            >
              Redefinir Filtros
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

const FilterSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.25rem;
`;

const PrimaryFiltersRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
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

const DateFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color-light);
  padding-top: 1rem;
`;

const DateFilterHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const DateFilterTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
`;

const DatePresetsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const PresetButton = styled.button`
  background-color: ${(props) => (props.$active ? 'var(--color-primary)' : 'var(--bg-surface-secondary)')};
  color: ${(props) => (props.$active ? '#ffffff' : 'var(--text-secondary)')};
  border: 1px solid ${(props) => (props.$active ? 'var(--color-primary)' : 'var(--border-color)')};
  border-radius: var(--radius-full);
  padding: 0.3rem 0.75rem;
  font-size: 0.775rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-primary);
    color: ${(props) => (props.$active ? '#ffffff' : 'var(--color-primary)')};
  }
`;

const DatePickerBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 280px;
  margin-top: 0.5rem;
`;

const DateRangeBox = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
    max-width: 580px;
  }
`;

const RangeFieldCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const DateInputLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const DateInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.45rem 0.75rem;

  &:focus-within {
    border-color: var(--border-color-focus);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

const StyledDateInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--text-main);
  font-weight: 600;
  outline: none;
`;

const ClearDateBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;

  &:hover {
    color: var(--color-danger);
  }
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
  gap: 0.4rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: 1px solid #c7d2fe;
  border-radius: var(--radius-full);
  padding: 0.25rem 0.7rem;
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
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
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