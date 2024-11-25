import styled from 'styled-components';

export default function Driver(props) {
  return (
    <Content>
      <p>Driver's name: {props.name}</p>
      <p>Value: {props.value}</p>
    </Content>);
}

const Content = styled.div`
  text-align: left;
  min-width: 200px;
  border: 1px solid black;
  margin: 2px;
  padding: 5px;
  p{
    font-size: 14px;
  }
`;
