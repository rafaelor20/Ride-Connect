import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { User, Filter } from 'lucide-react';

const DriverSelector = ({ drivers = [], selectedDriver = '', onSelect }) => {
  const navigate = useNavigate();

  // Deduplicate drivers by ID or name
  const uniqueDrivers = drivers.filter(
    (driver, index, self) =>
      self.findIndex((t) => (t.id && t.id === driver.id) || t.name === driver.name) === index
  );

  const handleChange = (event) => {
    const driverId = event.target.value;
    if (onSelect) {
      onSelect(driverId);
    } else if (driverId) {
      localStorage.setItem('driverId', JSON.stringify(driverId));
      navigate('/rides-by-driver');
    }
  };

  return (
    <SelectorContainer>
      <SelectorLabel>
        <Filter size={15} color="var(--color-primary)" />
        <span>Filtrar por Motorista:</span>
      </SelectorLabel>
      <SelectWrapper>
        <StyledSelect value={selectedDriver} onChange={handleChange}>
          <option value="">Todos os motoristas</option>
          {uniqueDrivers.map((driver) => (
            <option key={driver.id || driver.name} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </StyledSelect>
      </SelectWrapper>
    </SelectorContainer>
  );
};

export default DriverSelector;

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  max-width: 320px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
`;

const SelectorLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
  white-space: nowrap;
`;

const SelectWrapper = styled.div`
  flex: 1;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.55rem 0.85rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-main);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--border-color-focus);
  }

  &:focus {
    border-color: var(--border-color-focus);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;
