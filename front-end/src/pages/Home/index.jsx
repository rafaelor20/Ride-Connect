import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Car, 
  MapPin, 
  History, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Star,
  Sparkles,
  Compass
} from 'lucide-react';

import AppLayout from '../../components/Layout/AppLayout';
import UserContext from '../../contexts/UserContext';

export default function Home() {
  const { userData } = useContext(UserContext);
  const userName = userData?.user?.name || userData?.name || 'Passageiro';

  return (
    <AppLayout>
      {/* Hero Welcome Banner */}
      <HeroSection>
        <HeroBadge>
          <Sparkles size={14} color="var(--color-primary)" />
          <span>Painel do Passageiro</span>
        </HeroBadge>
        <HeroTitle>
          Olá, <span>{userName}</span>! 👋
        </HeroTitle>
        <HeroSubtitle>
          Para onde você gostaria de ir hoje? Selecione uma opção rápida abaixo para iniciar ou consultar suas atividades.
        </HeroSubtitle>
      </HeroSection>

      {/* Main Action Cards Grid */}
      <ActionGrid>
        {/* Request Ride Card */}
        <ActionCard to="/estimate" $variant="primary">
          <CardHeader>
            <IconContainer $gradient="primary">
              <Compass size={28} color="#ffffff" strokeWidth={2.2} />
            </IconContainer>
            <CardTag $type="primary">Rápido & Fácil</CardTag>
          </CardHeader>
          <CardBody>
            <CardHeading>Solicitar Nova Viagem</CardHeading>
            <CardText>
              Informe o local de embarque e seu destino para calcular o trajeto, comparar opções de motoristas e tarifas.
            </CardText>
          </CardBody>
          <CardFooter>
            <ActionButton $type="primary">
              <span>Definir Trajeto</span>
              <ArrowRight size={18} />
            </ActionButton>
          </CardFooter>
        </ActionCard>

        {/* Ride History Card */}
        <ActionCard to="/rides" $variant="secondary">
          <CardHeader>
            <IconContainer $gradient="secondary">
              <History size={28} color="#ffffff" strokeWidth={2.2} />
            </IconContainer>
            <CardTag $type="secondary">Suas Atividades</CardTag>
          </CardHeader>
          <CardBody>
            <CardHeading>Histórico de Viagens</CardHeading>
            <CardText>
              Veja os detalhes de todas as viagens anteriores, consulte distâncias, datas, valores e filtre por motorista.
            </CardText>
          </CardBody>
          <CardFooter>
            <ActionButton $type="secondary">
              <span>Consultar Histórico</span>
              <ArrowRight size={18} />
            </ActionButton>
          </CardFooter>
        </ActionCard>
      </ActionGrid>

      {/* Feature / Highlight Section */}
      <FeaturesSection>
        <FeaturesTitle>Por que viajar com o Ride Connect?</FeaturesTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIconBox $color="indigo">
              <Zap size={20} />
            </FeatureIconBox>
            <div>
              <FeatureTitle>Cálculo em Tempo Real</FeatureTitle>
              <FeatureDesc>Rotas otimizadas e preços calculados com base na distância real.</FeatureDesc>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIconBox $color="amber">
              <Star size={20} />
            </FeatureIconBox>
            <div>
              <FeatureTitle>Motoristas Avaliados</FeatureTitle>
              <FeatureDesc>Escolha o profissional ideal baseado em avaliações e comentários de usuários.</FeatureDesc>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIconBox $color="emerald">
              <ShieldCheck size={20} />
            </FeatureIconBox>
            <div>
              <FeatureTitle>Segurança Garantida</FeatureTitle>
              <FeatureDesc>Viagens confirmadas com veículos cadastrados e total transparência.</FeatureDesc>
            </div>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </AppLayout>
  );
}

// Styled Components
const HeroSection = styled.div`
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease-out;

  @media (min-width: 768px) {
    margin-bottom: 2.5rem;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const HeroTitle = styled.h1`
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-main);
  margin-bottom: 0.5rem;

  span {
    color: var(--color-primary);
  }

  @media (min-width: 640px) {
    font-size: 2.35rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 640px;
  line-height: 1.6;

  @media (min-width: 640px) {
    font-size: 1.1rem;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.75rem 1.5rem;
  box-shadow: var(--shadow-md);
  text-decoration: none;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) =>
      props.$variant === 'primary'
        ? 'var(--color-primary-gradient)'
        : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: ${(props) =>
      props.$variant === 'primary' ? 'var(--border-color-focus)' : '#93c5fd'};
  }

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const IconContainer = styled.div`
  width: 54px;
  height: 54px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  background: ${(props) =>
    props.$gradient === 'primary'
      ? 'var(--color-primary-gradient)'
      : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'};
`;

const CardTag = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-full);
  background-color: ${(props) =>
    props.$type === 'primary' ? 'var(--color-primary-light)' : '#e0f2fe'};
  color: ${(props) =>
    props.$type === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)'};
`;

const CardBody = styled.div`
  margin-bottom: 1.5rem;
`;

const CardHeading = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
`;

const CardText = styled.p`
  font-size: 0.925rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${(props) =>
    props.$type === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)'};
  transition: gap var(--transition-fast);

  ${ActionCard}:hover & {
    gap: 0.75rem;
  }
`;

const FeaturesSection = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.75rem 1.5rem;
  box-shadow: var(--shadow-sm);

  @media (min-width: 640px) {
    padding: 2.25rem 2rem;
  }
`;

const FeaturesTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const FeatureIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${(props) => {
    switch (props.$color) {
      case 'amber':
        return `
          background-color: var(--color-warning-bg);
          color: var(--color-warning);
          border: 1px solid var(--color-warning-border);
        `;
      case 'emerald':
        return `
          background-color: var(--color-success-bg);
          color: var(--color-success);
          border: 1px solid var(--color-success-border);
        `;
      case 'indigo':
      default:
        return `
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          border: 1px solid #c7d2fe;
        `;
    }
  }}
`;

const FeatureTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.25rem;
`;

const FeatureDesc = styled.p`
  font-size: 0.825rem;
  color: var(--text-muted);
  line-height: 1.45;
  margin: 0;
`;
