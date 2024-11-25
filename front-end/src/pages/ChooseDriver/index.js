import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Page from '../../components/Page.js';
import { Container, Main, Content, ButtonsDiv } from '../../components/styles.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';
import Link from '../../components/Link.js';
import { useNavigate } from 'react-router-dom';

export default function ChooseDriver() {
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate'));
  console.log(rideEstimate);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    try {
      const ride = {
        origin: rideEstimate.origin,
        destination: rideEstimate.destination,
        distance: rideEstimate.distance,
        duration: rideEstimate.duration,
        driver: { id: rideEstimate.driver.id, 
          name: rideEstimate.driver.name, 
          value: rideEstimate.value 
        },
        
      };
      localStorage.setItem('ride', JSON.stringify(ride));
      navigate('/confirm');
    } catch (error) {
      toast('Could not choose a driver!');
    }
  }

  return (
    <Page>
      <Container>
        <Header/>
        <Main>
          <Content>
            <Link to="/estimate">
              <ButtonsDiv>
                <button >Return to estimateRide</button>
              </ButtonsDiv>
            </Link>
            <h1>Confirm your ride</h1>
            <p>Origin: {rideEstimate.origin}</p>
            <p>Destination: {rideEstimate.destination}</p>
            <p>Distance: {rideEstimate.distance}</p>
            <p>Duration: {rideEstimate.duration}</p>
            <p>Driver:</p>
            <p>     Id: {rideEstimate.driver.id}</p>
            <p>     Id: {rideEstimate.driver.name}</p>
            <p>Value: {rideEstimate.value}</p>
            <ButtonsDiv>
              <button onClick={submit}>Confirm</button>
            </ButtonsDiv>
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
