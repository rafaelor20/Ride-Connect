import React from 'react';
import styled from 'styled-components';

export default function Page({ children }) {
  return (
    <Container>
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-page);
  color: var(--text-main);
  box-sizing: border-box;
`;
