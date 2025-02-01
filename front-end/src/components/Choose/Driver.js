import styled from 'styled-components';

export default function Driver(props) {
  const review = props.driver.review.length > 0 ? props.driver.review[0] : { rating: 0, comment: 'No reviews yet' };
  return (
    <Content onClick={props.onClick}>
      <p>Name: {props.driver.name}</p>
      <p>Value: {props.driver.value}</p>
      <p>Description: {props.driver.description}</p>
      <p>Vehicle: {props.driver.vehicle}</p>
      <p>Rating: {review.rating} out of 5</p>
      <p>Comment: {review.comment}</p>
      <button>Click on this box to choose this driver!</button>
    </Content>);
}

const Content = styled.div`
  text-align: left;
  min-width: 320px;
  border: 1px solid black;
  margin: 2px;
  padding: 5px;
  p{
    font-size: 14px;
  }
`;
