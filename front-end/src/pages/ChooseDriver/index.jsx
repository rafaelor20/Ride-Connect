import Page from '../../components/Page.jsx';
import { Container, Main, Content } from '../../components/styles';
import Header from '../../components/Home/Header.jsx';
import Footer from '../../components/Footer.jsx';
import Link from '../../components/Link';

import Drivers from '../../components/Choose/Drivers';
import RouteMap from '../../components/RouteMap.jsx';

import styled from 'styled-components';

export default function ChooseDriver() {
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate'));
  return (
    <Page>
      <Header/>
      <Link to="/estimate">
        <button >Return to estimateRide</button>
      </Link>

      <Container>        
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
`;
