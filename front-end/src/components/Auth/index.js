import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 10px;
  color: var(--text-main);
  text-align: center;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: var(--text-secondary);
  display: block;
`;

export const MainRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0.75rem;
  width: 100%;
`;
