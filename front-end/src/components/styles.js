import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const Main = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const Content = styled.div`
  width: 100%;
  max-width: ${(props) => props.$maxWidth || '600px'};
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.5rem 1.25rem;
  box-shadow: var(--shadow-lg);
  box-sizing: border-box;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

export const CurrentAmount = styled.div`
  width: 100%;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-success);
  margin-bottom: 1rem;
  text-align: center;
`;

export const ButtonsDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const Label = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-main);
`;