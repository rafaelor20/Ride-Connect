import React from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Page from '../../components/Page.jsx';
import { Container, Main, Content, ButtonsDiv } from '../../components/styles';
import Header from '../../components/Home/Header.jsx';
import Footer from '../../components/Footer.jsx';
import Link from '../../components/Link';
import { useNavigate } from 'react-router-dom';

import useConfirm from '../../hooks/api/useConfirm';

export default function ConfirmRide() {
  const rideEstimate = JSON.parse(localStorage.getItem('rideEstimate')) || {};
  const rideConfirm = JSON.parse(localStorage.getItem('rideConfirm')) || {};
  const origin = JSON.parse(localStorage.getItem('origin')) || '';
  const destination = JSON.parse(localStorage.getItem('destination')) || '';
  
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
      toast(`${error.message}`);
      navigate('/choose-driver');
    }
  }

  return (
    <Page>
      <Container>
        <Header/>
        <Main>
          <Content>
            <ContentDiv>
              <h1>Confirm your ride:</h1>
              <p>Origin: {origin}</p>
              <p>Destination: {destination}</p>
              <p>Distance: {rideEstimate.distance}</p>
              <p>Duration: {rideEstimate.duration}</p>
              <p>Driver Name: {rideConfirm.name}</p>
              <p>Driver Vehicle: {rideConfirm.vehicle}</p>
              <p>Value: {rideConfirm.value}</p>
              <ButtonsDiv>
                <button onClick={submit} disabled={confirmLoading}>Confirm</button>
              </ButtonsDiv>
            </ContentDiv>
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

const ContentDiv = styled.div`
  min-width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
  justify-content: center;
  margin: 20px;
`;
