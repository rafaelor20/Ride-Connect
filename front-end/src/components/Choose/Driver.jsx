import styled from 'styled-components';

export default function Driver(props) {
  const review = props.driver.review.length > 0 ? props.driver.review[0] : { rating: 0, comment: 'No reviews yet' };
  return (
    <Content onClick={props.onClick}>
      <FirstLine>
        <h1>{props.driver.name}</h1>
        <p>{review.rating} out of 5 ({props.driver.review.length})</p>
      </FirstLine>
      <FirstLine>
        <h1>{props.driver.vehicle}</h1>
        <p>$ {props.driver.value}</p>
      </FirstLine>
      <p>Description: {props.driver.description}</p>
      <p>Comment: {review.comment}</p>
    </Content>);
}

const Content = styled.div`
  text-align: left;
  width: 300px;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 3px;
  color: black;

  &:hover {
    cursor: pointer;
    background-color: #ffe2fe;
  }

  p{
    font-size: 14px;
    margin: 0;
  }
`;

const FirstLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-weight: bold;
    font-size: 16px;
  }
  p {
    font-size: 14px;
  }
`;
