import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout({ children, maxWidth = '1200px' }) {
  return (
    <LayoutWrapper>
      <Navbar />
      <MainContainer $maxWidth={maxWidth}>
        {children}
      </MainContainer>
      <Footer />
    </LayoutWrapper>
  );
}

const LayoutWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-page);
`;

const MainContainer = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${(props) => props.$maxWidth || '1200px'};
  margin: 0 auto;
  padding: 1.25rem 1rem 2.5rem;
  box-sizing: border-box;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem 3rem;
  }

  @media (min-width: 1024px) {
    padding: 2.5rem 2rem 4rem;
  }
`;
