import styled from 'styled-components';
import backSquare from '../assets/back-square.svg';
import Link from './Link';

export default function Header(props) {
  return (
    <Container>
      <p>addresses again:</p>
      <Link to="/estimate">
        <img src={backSquare} alt="return button" width="23" height="24" filter='invert(1)' style={{  margin: '10px 0px 0px 0px' }}/>
      </Link>
    </Container>
  );
}

const Container = styled.div`
  min-width: auto;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-family: 'Raleway', sans-serif;
  font-weight: bold;
  font-size: 22px;
  font-weight: 700;
  line-height: 31px;
  text-align: left;
  filter: invert(1);
`;
