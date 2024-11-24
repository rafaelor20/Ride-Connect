import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Page from '../../components/Page';
import { Container, Main, Content, ButtonsDiv } from '../../components/styles.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';
import Link from '../../components/Link.js';
import { useNavigate } from 'react-router-dom';

import useConfirm from '../../hooks/api/useConfirm';

export default function ConfirmRide() {
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate'));
  const navigate = useNavigate();
  const { confirmLoading, confirm } = useConfirm();

  async function submit(event) {
    event.preventDefault();
    try {
      await confirm({ origin: rideEstimate.origin, destination: rideEstimate.destination, 
        distance: rideEstimate.distance, duration: rideEstimate.duration, 
        driver: { id: rideEstimate.driver.id, name: rideEstimate.driver.name },
        value: rideEstimate.value });
      toast('Ride confirmed!');
      navigate('/home');
    } catch (error) {
      toast('Could not confirm ride!');
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
                <button disabled={confirmLoading}>Return to estimateRide</button>
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
              <button onClick={submit} disabled={confirmLoading}>Confirm</button>
            </ButtonsDiv>
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
