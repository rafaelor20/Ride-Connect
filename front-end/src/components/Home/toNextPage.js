import styled from 'styled-components';
import Link from '../Link';

export default function ToNextPage(props) {
  return (
    <Link to={props.nextPage}>
      <Content>
        <p>
          {props.description}
        </p>
      </Content>
    </Link>
  );
}

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    min-width: 180px;
    height: 40%;
    min-height: 50px;
    background-color: black;
    p{
        font-size: 18px;
        font-weight: bold;
        color: white;
    }
`;
