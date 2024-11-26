import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';
import Rides from '../../components/Historic/rides';
import Link from '../../components/Link.js';

import useGetRidesApi from '../../hooks/api/useGetRides.js';

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  
  useEffect(() => {
    async function fetchRides() {
      try {
        const data = await getRides({ driver_id: null });
        setRides(data);
      } catch (error) {
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
            <p>Rides:</p>
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
