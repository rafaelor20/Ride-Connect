import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import Button from '../../components/Form/Button';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';
import RidesByDriver from '../../components/HistoricByDriver/ridesByDriver.js';
import Link from '../../components/Link.js';

import useGetRidesApi from '../../hooks/api/useGetRides.js';

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const driver_id = JSON.parse(localStorage.getItem('driverId'));
  const customer_id = JSON.parse(localStorage.getItem('customer_id'));
  
  useEffect(() => {
    async function fetchRides() {
      try {
        const data = await getRides({ customer_id: customer_id, driver_id: driver_id });
        setRides(data);
      } catch (error) {
        toast.error('Failed to fetch rides' + error.message);
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
        </Main>
        <Footer />
      </Container>
    </Page>
  );
}
