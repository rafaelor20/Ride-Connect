import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';
import Driver from './Driver';

export default function Drivers() {
  const rideEstimateString = localStorage.getItem('rideEstimate');
  let rideEstimate;
  const navigate = useNavigate();

  try {
    rideEstimate = JSON.parse(rideEstimateString) || { options: [] };
  } catch (error) {
    console.error('Failed to parse ride estimate from localStorage', error);
    rideEstimate = { options: [] };
  }

  const options = rideEstimate?.options || [];

  const handleSelectDriver = (option) => {
    localStorage.setItem('rideConfirm', JSON.stringify(option));
    navigate('/confirm');
  };

  if (options.length === 0) {
    return (
      <EmptyDriversState>
        <AlertCircle size={36} color="var(--color-warning)" />
        <h3>Nenhum motorista disponível para este trajeto</h3>
        <p>A distância pode ser inferior ao mínimo aceito pelos motoristas parceiros ou não há veículos disponíveis no momento.</p>
      </EmptyDriversState>
    );
  }

  return (
    <DriversListContainer>
      <DriversHeader>
        <HeaderTitleWrap>
          <Users size={20} color="var(--color-primary)" />
          <HeaderTitle>Motoristas Disponíveis ({options.length})</HeaderTitle>
        </HeaderTitleWrap>
        <HeaderSubtitle>Ordenados pelo melhor valor para o seu percurso</HeaderSubtitle>
      </DriversHeader>

      <DriversGrid>
        {options.map((option) => (
          <Driver 
            key={option.id} 
            driver={option} 
            onClick={() => handleSelectDriver(option)} 
          />
        ))}
      </DriversGrid>
    </DriversListContainer>
  );
}

const DriversListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DriversHeader = styled.div`
  margin-bottom: 1.25rem;
`;

const HeaderTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const HeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
`;

const DriversGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmptyDriversState = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2.5rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  h3 {
    font-size: 1.1rem;
    color: var(--text-main);
  }

  p {
    font-size: 0.9rem;
    color: var(--text-muted);
    max-width: 380px;
  }
`;
