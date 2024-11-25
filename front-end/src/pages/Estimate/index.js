import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';

import useEstimateApi from '../../hooks/api/useEstimate.js';  

export default function EstimateRide() {
  const [ origin, setOrigin ] = useState('');
  const [ destination, setDestination ] = useState('');
  const navigate = useNavigate();
  const { estimateLoading, estimate } = useEstimateApi();

  async function submit(event) {
    event.preventDefault();
    
    try {
      const response = await estimate({ origin, destination });
      
      localStorage.setItem('rideEstimate', JSON.stringify(response));
      toast('Estimate success!');
      navigate('/choose-driver');
    } catch (error) {
      toast('Não foi possível fazer o cadastro!');
    }
  }

  return (
    <Page>
      <Container>
        <Header/>
        <Main>
          <Content>
            <form onSubmit={submit}>
              <Input
                label="Origin"
                type="text"
                fullWidth
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
              <Input
                label="Destination"
                type="text"
                fullWidth
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <Button type="submit" color="primary" fullWidth disabled={estimateLoading}>
              Estimate
              </Button>
            </form>
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
