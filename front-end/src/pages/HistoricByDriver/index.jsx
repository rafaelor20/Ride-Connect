import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  User, 
  ArrowLeft, 
  History, 
  Plus, 
  Calendar as CalendarIcon,
  Search,
  Filter,
  X,
  RotateCcw,
  Compass
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import Button from '../../components/Form/Button';
import RideCard from '../../components/Historic/RideCard';
import useGetRidesApi from '../../hooks/api/useGetRides';

export default function HistoricByDriver() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date and Search Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilterMode, setDateFilterMode] = useState('all'); // 'all', 'today', '7days', '30days', 'this_month', 'custom_single', 'custom_range'
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  // Helper to get local date string YYYY-MM-DD
  const getLocalDateString = (dateObj) => {
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter rides by date and search query
  const filteredRides = useMemo(() => {
    const now = new Date();
    const todayStr = getLocalDateString(now);

    return rides.filter((ride) => {
      // 1. Date Filter
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

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const origin = (ride.origin?.address || '').toLowerCase();
        const dest = (ride.destination?.address || '').toLowerCase();
        return origin.includes(query) || dest.includes(query);
      }

      return true;
    });
  }, [rides, dateFilterMode, singleDate, startDate, endDate, searchQuery]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setDateFilterMode('all');
    setSingleDate('');
    setStartDate('');
    setEndDate('');
  };

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

  const isAnyFilterActive = searchQuery || dateFilterMode !== 'all';

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
            Exibindo corridas realizadas com este motorista parceiro com opções de filtro por data e endereço.
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

      {/* Filter Toolbar */}
      <FilterSectionWrapper>
        {/* Search Input */}
        <SearchBox>
          <Search size={18} color="var(--text-muted)" />
          <SearchInput
            type="text"
            placeholder="Buscar por endereço de origem ou destino..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ClearSearchBtn onClick={() => setSearchQuery('')} title="Limpar busca">
              <X size={15} />
            </ClearSearchBtn>
          )}
        </SearchBox>

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

          {/* Date Pickers based on active mode */}
          {dateFilterMode === 'custom_single' && (
            <DatePickerBox>
              <DateInputLabel>Selecione o dia da viagem:</DateInputLabel>
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

      {/* Active Filter Chips */}
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
            <span>Limpar filtros</span>
          </ResetFiltersBtn>
        </ActiveFilterBar>
      )}

      {/* Main Content */}
      {loading ? (
        <LoadingState>
          <LoadingSpinner />
          <p>Carregando histórico do motorista...</p>
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
              <RideCard key={ride.id} ride={ride} />
            ))}
          </RidesGrid>
        </RidesSection>
      ) : (
        <EmptyStateCard>
          <EmptyIconWrapper>
            <User size={40} color="var(--text-muted)" />
          </EmptyIconWrapper>
          <EmptyTitle>
            {rides.length === 0 
              ? 'Nenhuma viagem encontrada com este motorista' 
              : 'Nenhuma viagem encontrada para este motorista com os filtros selecionados'}
          </EmptyTitle>
          <EmptyDesc>
            {rides.length === 0 
              ? 'Não constam viagens registradas com este motorista parceiro no momento.'
              : 'Tente selecionar outro período ou limpar os filtros de busca.'}
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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.5rem 0.85rem;
  width: 100%;
  box-sizing: border-box;
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