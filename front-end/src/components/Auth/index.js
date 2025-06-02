import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-top: 10px;
  color: white;
`;

export const Label = styled.h1`
  font-size: 12px;
  margin-bottom: 1px;
  color: grey;
`;

export const MainRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  margin: 10px;
  min-width: 20%;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
