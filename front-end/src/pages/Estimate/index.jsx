import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  MapPin, 
  Navigation, 
  ArrowUpDown, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Sparkles,
  Info
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import StepIndicator from '../../components/UI/StepIndicator';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import useEstimateApi from '../../hooks/api/useEstimate';

export default function EstimateRide() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();
  const { estimateLoading, estimate } = useEstimateApi();

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  async function submit(event) {
    event.preventDefault();

    const trimmedOrigin = origin.trim();
    const trimmedDestination = destination.trim();

    if (!trimmedOrigin || !trimmedDestination) {
      toast.error('Informe o local de embarque (origem) e o destino.');
      return;
    }

    if (trimmedOrigin.toLowerCase() === trimmedDestination.toLowerCase()) {
      toast.error('O ponto de partida e o destino não podem ser iguais.');
      return;
    }

    try {
      const response = await estimate({ origin: trimmedOrigin, destination: trimmedDestination });
      localStorage.setItem('origin', JSON.stringify(trimmedOrigin));
      localStorage.setItem('destination', JSON.stringify(trimmedDestination));
      localStorage.setItem('rideEstimate', JSON.stringify(response));
      toast.success('Rota calculada com sucesso!');
      navigate('/choose-driver');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Erro ao estimar trajeto';
      toast.error(`Não foi possível calcular a rota: ${msg}`);
    }
  }

  return (
    <AppLayout maxWidth="720px">
      <StepIndicator currentStep={1} />

      <PageHeading>
        <PageTitle>Para onde vamos?</PageTitle>
        <PageSubtitle>
          Insira o ponto de embarque e seu destino para calcularmos a melhor rota e os motoristas disponíveis.
        </PageSubtitle>
      </PageHeading>

      <EstimateCard>
        <form onSubmit={submit}>
          <RouteInputContainer>
            {/* Visual connector line between origin and destination */}
            <ConnectorTrack>
              <OriginDot />
              <ConnectorLine />
              <DestinationDot />
            </ConnectorTrack>

            <InputsColumn>
              <Input
                label="Ponto de Partida (Origem)"
                id="origin-input"
                placeholder="Ex: Av. Paulista, 1578 - Bela Vista, São Paulo"
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />

              <Input
                label="Destino Final"
                id="destination-input"
                placeholder="Ex: Aeroporto de Congonhas - São Paulo"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </InputsColumn>

            {/* Invert / Swap Button */}
            <SwapButtonWrapper>
              <SwapButton 
                type="button" 
                onClick={handleSwap} 
                title="Inverter origem e destino"
                disabled={estimateLoading}
              >
                <ArrowUpDown size={18} />
              </SwapButton>
            </SwapButtonWrapper>
          </RouteInputContainer>

          {/* Quick Suggestions Chips */}
          <SuggestionsContainer>
            <SuggestionsLabel>
              <Sparkles size={13} />
              <span>Sugestões rápidas de teste:</span>
            </SuggestionsLabel>
            <ChipsWrap>
              <ChipButton 
                type="button" 
                onClick={() => {
                  setOrigin('Av. Paulista, 1000, São Paulo');
                  setDestination('Parque Ibirapuera, São Paulo');
                }}
              >
                Av. Paulista ➔ Ibirapuera
              </ChipButton>
              <ChipButton 
                type="button" 
                onClick={() => {
                  setOrigin('Aeroporto de Guarulhos, SP');
                  setDestination('Avenida Brigadeiro Faria Lima, São Paulo');
                }}
              >
                Guarulhos ➔ Faria Lima
              </ChipButton>
            </ChipsWrap>
          </SuggestionsContainer>

          <SubmitWrapper>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={estimateLoading}
              icon={Search}
            >
              Calcular Rota e Ver Motoristas
            </Button>
          </SubmitWrapper>
        </form>

        <CardFooterNav>
          <StyledBackLink to="/home">
            <ArrowLeft size={16} />
            <span>Voltar ao Início</span>
          </StyledBackLink>
        </CardFooterNav>
      </EstimateCard>
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
  margin-bottom: 0.4rem;

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

const EstimateCard = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.75rem 1.25rem;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.3s ease-out;

  @media (min-width: 640px) {
    padding: 2.25rem 2rem;
  }
`;

const RouteInputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const ConnectorTrack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1.85rem;
  padding-bottom: 1.5rem;
  height: 120px;
  justify-content: space-between;
`;

const OriginDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background-color: var(--color-success);
  box-shadow: 0 0 0 3px var(--color-success-bg);
`;

const ConnectorLine = styled.div`
  width: 2px;
  flex: 1;
  background: dashed 2px #cbd5e1;
  margin: 4px 0;
`;

const DestinationDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
`;

const InputsColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SwapButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SwapButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
    border-color: var(--border-color-focus);
    transform: rotate(180deg);
  }
`;

const SuggestionsContainer = styled.div`
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  margin: 0.5rem 0 1.5rem;
  border: 1px dashed var(--border-color);
`;

const SuggestionsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const ChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ChipButton = styled.button`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: var(--color-primary-light);
  }
`;

const SubmitWrapper = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1.25rem;
`;

const CardFooterNav = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--border-color-light);
  padding-top: 1rem;
`;

const StyledBackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: var(--text-main);
    text-decoration: underline;
  }
`;
