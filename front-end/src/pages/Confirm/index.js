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
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate')) || {};
  const rideConfirm = JSON.parse(localStorage.getItem('rideConfirm')) || {};
  const origin = JSON.parse(localStorage.getItem('origin')) || '';
  const destination = JSON.parse(localStorage.getItem('destination')) || '';

  console.log(origin);
  console.log(destination);
  console.log(rideEstimate);
  console.log(rideConfirm);
  const navigate = useNavigate();
  const { confirmLoading, confirm } = useConfirm();

  async function submit(event) {
    event.preventDefault();
    try {
      await confirm({ origin: origin, destination: destination, 
        distance: rideEstimate.distance, duration: rideEstimate.duration, 
        driver: { id: rideConfirm.id, name: rideConfirm.name },
        value: rideConfirm.value });
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
            
            <h1>Confirm your ride</h1>
            <p>Origin: {origin}</p>
            <p>Destination: {destination}</p>
            <p>Distance: {rideEstimate.distance}</p>
            <p>Duration: {rideEstimate.duration}</p>
            <p>Driver:</p>
            <p>     Id: {rideConfirm.id}</p>
            <p>     Id: {rideConfirm.name}</p>
            <p>Value: {rideConfirm.value}</p>
            <ButtonsDiv>
              <button onClick={submit} disabled={confirmLoading}>Confirm</button>
            </ButtonsDiv>
          </Content>
          <ButtonsDiv>
            <Link to="/home">
              <ButtonsDiv>
                <button disabled={confirmLoading}>Return to home</button>
              </ButtonsDiv>
            </Link>
            <Link to="/estimate">
              <ButtonsDiv>
                <button disabled={confirmLoading}>Return to estimateRide</button>
              </ButtonsDiv>
            </Link>
          </ButtonsDiv>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
