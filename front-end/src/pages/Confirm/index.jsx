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
            <RideDiv>
              <p>Origin:</p>
              <h1>{origin}</h1>
              <p>Destination:</p>
              <h1>{destination}</h1>
              <p>Distance:</p>
              <h1>{rideEstimate.distance}</h1>
              <p>Duration:</p>
              <h1>{rideEstimate.duration}</h1>
              <p>Driver:</p>
              <h1>{rideConfirm.name}</h1>
              <p>Driver:</p>
              <h1>{rideConfirm.vehicle}</h1>
              <p>Driver Value:</p>
              <h1>{rideConfirm.value}</h1>
            </RideDiv>
          </Content>
          <ButtonsDiv>
                <ConfirmButton onClick={submit} disabled={confirmLoading}>Confirm</ConfirmButton>
          </ButtonsDiv>
          <ReturnButtons>
            <Link to="/home">
              <ButtonsDiv>
                <button disabled={confirmLoading}>Return to home</button>
              </ButtonsDiv>
            </Link>
            <Link to="/estimate">
              <ButtonsDiv>
                <button disabled={confirmLoading}>Return to estimate</button>
              </ButtonsDiv>
            </Link>
          </ReturnButtons>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};

const RideDiv = styled.div`
  max-width: 90%;
  min-width: 90%;
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: start;
  background-color: white;
  overflow-y: auto;
  margin: 5px 0px;
  padding: 10px 0px;

  h1 {
    color: black;
    font-size: 16px;
    font-weight: bold;
    margin-top: 2px; /* Add space above each h1 */
    margin-bottom: 8px; /* Add space below each h1 */
  }

  p {
    color: black;
    font-size: 14px;
    margin-top: 2px; /* Add space above each p */
    margin-bottom: 1px; /* Optional: small space below p */
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
`;

const ConfirmButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
  &:hover {
    background-color: darkgreen;
  }
  &:active {
    background-color: lightgreen;
  }
  transition: background-color 0.3s ease;
`;

const ReturnButtons = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  button {
    width: 120px;
    height: 70px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    &:disabled {
      background-color: grey;
      cursor: not-allowed;
    }
    &:hover {
      background-color: darkblue;
    }
    &:active {
      background-color: lightblue;
    }
    transition: background-color 0.3s ease;
  }
`;