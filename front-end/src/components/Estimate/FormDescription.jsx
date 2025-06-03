import styled from 'styled-components';

export default function FormDescription(props) {
  return (
    <Container>
      <p>{props.text}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  max-height: 30px;
  margin-top: 10px;
  padding: 1px;
  p {
    color: #3b3b3b;
    font-size: 14px;
    margin: 0;
  }
`;