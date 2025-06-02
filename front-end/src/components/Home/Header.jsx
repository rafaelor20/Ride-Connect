import styled from 'styled-components';
import logoutButton from '../../assets/log-out.svg';
import Link from '../Link';

export default function Header() {
  return (
    <Container>
      <p>Ride Connect</p>
      <Link to="/">
        <img src={logoutButton} alt="Log out button" width="23" height="24" />
      </Link>
      
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin-top: 15px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  filter: invert(1);
  p {
    font-size: 24px;
    font-weight: bold;
    color: #fff !important; /* Force white text */
    filter: invert(1); /* Invert text color back to white if parent is inverted */
  }
`;
