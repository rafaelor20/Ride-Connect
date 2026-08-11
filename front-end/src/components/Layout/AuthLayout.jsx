import React from 'react';
import styled from 'styled-components';
import { Car, ShieldCheck, Zap, Star } from 'lucide-react';
import Footer from './Footer';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <AuthPageContainer>
      {/* Subtle Background Glows */}
      <BackgroundGlowLeft />
      <BackgroundGlowRight />

      <AuthHeader>
        <BrandBadge to="/">
          <LogoIconWrapper>
            <Car size={26} color="#ffffff" strokeWidth={2.5} />
          </LogoIconWrapper>
          <BrandTitle>
            Ride<span>Connect</span>
          </BrandTitle>
        </BrandBadge>
        <BrandTagline>A plataforma inteligente para suas corridas diárias</BrandTagline>
      </AuthHeader>

      <AuthCardWrapper>
        <AuthCard>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
          {children}
        </AuthCard>

        {/* Feature badges underneath */}
        <FeaturePills>
          <FeaturePill>
            <Zap size={14} color="var(--color-primary)" />
            <span>Estimativas em tempo real</span>
          </FeaturePill>
          <FeaturePill>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Motoristas qualificados</span>
          </FeaturePill>
          <FeaturePill>
            <Star size={14} color="var(--color-warning)" />
            <span>Melhores avaliações</span>
          </FeaturePill>
        </FeaturePills>
      </AuthCardWrapper>

      <Footer />
    </AuthPageContainer>
  );
}

const AuthPageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-page);
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const BackgroundGlowLeft = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 45vw;
  height: 45vw;
  max-width: 500px;
  max-height: 500px;
  border-radius: var(--radius-full);
  background: radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 0;
`;

const BackgroundGlowRight = styled.div`
  position: absolute;
  top: 15%;
  right: -10%;
  width: 45vw;
  height: 45vw;
  max-width: 500px;
  max-height: 500px;
  border-radius: var(--radius-full);
  background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 0;
`;

const AuthHeader = styled.div`
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
  padding: 0 1rem;
`;

const BrandBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  text-decoration: none;
`;

const LogoIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow);
`;

const BrandTitle = styled.h1`
  font-family: var(--font-family-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
  margin: 0;

  span {
    color: var(--color-primary);
  }
`;

const BrandTagline = styled.p`
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
`;

const AuthCardWrapper = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 0 1rem;
  margin-bottom: 2.5rem;
  z-index: 1;
  box-sizing: border-box;
`;

const AuthCard = styled.div`
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 2rem 1.5rem;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;

  @media (min-width: 640px) {
    padding: 2.5rem 2rem;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-main);
  text-align: center;
  margin-bottom: 0.35rem;
`;

const CardSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 1.75rem;
`;

const FeaturePills = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

const FeaturePill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 0.3rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
`;
