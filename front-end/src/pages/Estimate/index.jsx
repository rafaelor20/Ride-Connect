import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page.jsx';
import { Container, Main, Content } from '../../components/styles';
import FormDescription from '../../components/Estimate/FormDescription.jsx';
import Input from '../../components/Form/Input.jsx';
import Button from '../../components/Form/Button.jsx';
import Header from '../../components/Home/Header.jsx';
import Footer from '../../components/Footer.jsx';

import useEstimateApi from '../../hooks/api/useEstimate';  

export default function EstimateRide() {
  const [ origin, setOrigin ] = useState('');
  const [ destination, setDestination ] = useState('');
  const navigate = useNavigate();
  const { estimateLoading, estimate } = useEstimateApi();

  async function submit(event) {
    event.preventDefault();
    
    try {
      if (!origin || !destination) {
        toast('Origin and Destination are required!');
        return;
      } else if (origin === destination) {
        toast('Origin and Destination must be different!');
        return;
      } else {
        const response = await estimate({ origin, destination });
        localStorage.setItem('origin', JSON.stringify(origin));
        localStorage.setItem('destination', JSON.stringify(destination));
        localStorage.setItem('rideEstimate', JSON.stringify(response));
        navigate('/choose-driver');
      }
    } catch (error) {
      toast('Something is wrong!, ' + error.message);
    }
  }

  return (
    <Page>
      <Container>        
        <Main>
          <Header/>
          <Content>
            <form onSubmit={submit}>
              <FormDescription text="Where to pick you up:" />
              <Input
                label="Origin"
                type="text"
                fullWidth
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
              <FormDescription text="Where are you going:" />
              <Input
                label="Destination"
                type="text"
                fullWidth
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <Button type="submit" color="primary" fullWidth disabled={estimateLoading}>
              Estimate your ride
              </Button>
            </form>
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
