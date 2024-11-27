import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import Rides from '../../components/Historic/rides';

import useGetRidesApi from '../../hooks/api/useGetRides.js';

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const customer_id = JSON.parse(localStorage.getItem('customer_id'));
  
  useEffect(() => {
    async function fetchRides() {
      try {
        const data = await getRides({ customer_id: customer_id, driver_id: null });
        setRides(data);
      } catch (error) {
        toast.error('Failed to get rides:' + error.message);
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
            <p>Click on one of the boxes below to</p>
            <p>filter the list of rides by it's driver:</p>
            {rides.length > 0 ? (
              <Rides rides={rides} />
            ) : (
              <p>No rides found</p>
            )}
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
}
