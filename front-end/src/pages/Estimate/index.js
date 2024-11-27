import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Footer from '../../components/Footer.js';

import useEstimateApi from '../../hooks/api/useEstimate.js';  

export default function EstimateRide() {
  const [ origin, setOrigin ] = useState('');
  const [ destination, setDestination ] = useState('');
  const [ customer_id, setCustomer_id ] = useState('');
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
        const response = await estimate({ customer_id, origin, destination });
        localStorage.setItem('origin', JSON.stringify(origin));
        localStorage.setItem('destination', JSON.stringify(destination));
        localStorage.setItem('customer_id', JSON.stringify(customer_id));
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
          <Content>
            <form onSubmit={submit}>
              <Input
                label="Customer id"
                type="text"
                fullWidth
                value={customer_id}
                onChange={(e) => setCustomer_id(e.target.value)}
              />
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
