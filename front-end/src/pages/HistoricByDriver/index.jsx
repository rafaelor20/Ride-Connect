import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Page from '../../components/Page.jsx';
import { Container, Main, Content } from '../../components/styles';
import Button from '../../components/Form/Button.jsx';
import Header from '../../components/Home/Header.jsx';
import Footer from '../../components/Footer.jsx';
import RidesByDriver from '../../components/HistoricByDriver/ridesByDriver';
import Link from '../../components/Link.js';

import useGetRidesApi from '../../hooks/api/useGetRides.js';

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const driver_id = JSON.parse(localStorage.getItem('driverId'));
  
  useEffect(() => {
    async function fetchRides() {
      try {
        const data = await getRides({ driver_id: driver_id });
        setRides(data);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Failed to fetch rides');
      }
    }
    fetchRides();
  }, []);

  return (
    <Page>
      <Container>
        <Header />
        <Main>
          <Content>
            <p>Rides with driver:</p>
            {rides.length > 0 ? (
              <RidesByDriver rides={rides} />
            ) : (
              <p>No rides found</p>
            )}
          </Content>
          <Link to="/rides">
            <Button>Back to all rides</Button>
          </Link>
          <Link to="/home">
            <Button>Back to home page</Button>
          </Link>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
}
