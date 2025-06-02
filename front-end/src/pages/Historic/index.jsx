import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Page from '../../components/Page.jsx';
import { Container, Main, Content } from '../../components/styles';
import Button from '../../components/Form/Button.jsx';
import Header from '../../components/Home/Header.jsx';
import Footer from '../../components/Footer.jsx';
import Rides from '../../components/Historic/rides';
import Link from '../../components/Link';

import useGetRidesApi from '../../hooks/api/useGetRides';

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  
  useEffect(() => {
    async function fetchRides() {
      try {
        const data = await getRides({ driver_id: null });
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
            <p>Click on one of the boxes below to</p>
            <p>filter the list of rides by it's driver:</p>
            {rides.length > 0 ? (
              <Rides rides={rides} />
            ) : (
              <p>No rides found</p>
            )}
          </Content>
          <Link to="/home">
            <Button>Back to home page</Button>
          </Link>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
}
