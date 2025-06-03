import Page from '../../components/Page.jsx';
import { Container, Main, Content, ButtonsDiv } from '../../components/styles';
import Header from '../../components/Home/Header.jsx';
import Footer from '../../components/Footer.jsx';
import Link from '../../components/Link';
import Button from '../../components/Form/Button.jsx';

import Drivers from '../../components/Choose/Drivers';
import RouteMap from '../../components/RouteMap.jsx';

import styled from 'styled-components';

export default function ChooseDriver() {
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate'));
  return (
    <Page>
      <Container>
        <Header/>
        <Link to="/estimate">
          <Button>
             {'return to estimate ride page'}
          </Button>
        </Link>  
        <Main>
          <MapContainer>
            <RouteMap origin={rideEstimate.origin} destination={rideEstimate.destination} />
          </MapContainer>  
          <Content>
            <Drivers/>
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};

const MapContainer = styled.div`
  margin: 10px;
`;
