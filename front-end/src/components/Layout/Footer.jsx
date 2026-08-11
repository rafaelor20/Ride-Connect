import React from 'react';
import styled from 'styled-components';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <BrandStatus>
            <StatusDot />
            <span>Sistema Operacional 100% Online</span>
          </BrandStatus>
          <SecurityBadge>
            <ShieldCheck size={16} />
            <span>Viagens Seguras & Monitoradas</span>
          </SecurityBadge>
        </FooterTop>
        <Divider />
        <FooterBottom>
          <CopyrightText>
            &copy; {new Date().getFullYear()} <strong>Ride Connect</strong>. Todos os direitos reservados.
          </CopyrightText>
          <FooterLinks>
            <span>Termos de Uso</span>
            <span>&bull;</span>
            <span>Privacidade</span>
            <span>&bull;</span>
            <span>Suporte</span>
          </FooterLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  width: 100%;
  margin-top: auto;
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const BrandStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--color-success);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--border-color-light);
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.825rem;
  color: var(--text-muted);

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.825rem;

  strong {
    color: var(--text-main);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);

  span:not(:nth-child(even)):hover {
    color: var(--color-primary);
    cursor: pointer;
  }
`;
