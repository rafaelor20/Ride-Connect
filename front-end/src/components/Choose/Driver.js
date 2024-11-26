import styled from 'styled-components';

export default function Driver(props) {
  return (
    <Content onClick={props.onClick}>
      <p>Driver's name: {props.driver.name}</p>
      <p>Value: {props.driver.value}</p>
      <p>Click on this box to choose this driver!</p>
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
