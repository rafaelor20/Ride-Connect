import Page from '../../components/Page.js';
import { Container, Main, Content } from '../../components/styles.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';
import Link from '../../components/Link.js';

import Drivers from '../../components/Choose/Drivers.js';
import RouteMap from '../../components/RouteMap.js';

import styled from 'styled-components';

export default function ChooseDriver() {
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate'));
  return (
    <Page>
      <Header/>
      <Link to="/estimate">
        <button >Return to estimateRide</button>
      </Link>
      <MapContainer>
        <RouteMap origin={rideEstimate.origin} destination={rideEstimate.destination} />
      </MapContainer>
      <Container>        
        <Main>          
          <Content>

            <Drivers />
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};

const MapContainer = styled.div`
  width: 500px;
  height: 500px;
`;
