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

import styled from 'styled-components';

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
            <StyledRides>
              <p>Click on one of the boxes below to</p>
              <p>filter the rides by it's driver:</p>
              {rides.length > 0 ? (
                <Rides rides={rides} />
              ) : (
                <p>No rides found</p>
              )}
            </StyledRides>
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


const StyledRides = styled.div`
  overflow-y: auto;

  p {
    color: black;
  }

    /* Add spacing between Driver elements */
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }

  /* Hide scrollbar for Webkit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
`;