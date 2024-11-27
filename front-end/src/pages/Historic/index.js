import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import Rides from '../../components/Historic/rides';
import { useNavigate } from 'react-router-dom';

import useGetRidesApi from '../../hooks/api/useGetRides.js';

function returnUniqueDrivers(rides) {
  const uniqueDrivers = [];
  rides.forEach((ride) => {
    if (!uniqueDrivers.some((driver) => driver.id === ride.driverId)) {
      uniqueDrivers.push({ id: ride.driverId, name: ride.driver.name });
    }
  });
  
  return uniqueDrivers;
}

export default function Historic() {
  const { getRides } = useGetRidesApi();
  const [rides, setRides] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const customer_id = JSON.parse(localStorage.getItem('customer_id'));
  const uniqueDrivers = returnUniqueDrivers(rides);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchRides() {
      try {
        const data = await getRides({ customer_id: customer_id, driver_id: null });
        setRides(data);
      } catch (error) {
        toast.error('Failed to get rides:' + error.message);
      }
    }
    fetchRides();
  }, []);

  async function applyFilter() {
    try {
      if (!selectedDriver || selectedDriver === '') {
        toast.error('Please select a driver');
      } else {
        localStorage.setItem('driverId', selectedDriver);
        navigate('/rides-by-driver');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Page>
      <Container>
        <Header />
        <Main>
          <Content>
            <div>
              <label htmlFor="driver-select">Select a driver:</label>
              <select
                id="driver-select"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">--Please choose a driver--</option>
                {uniqueDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
              <button onClick={applyFilter}>Apply Filter</button>
            </div>
            <p>Or click on one of the boxes below to</p>
            <p>filter the list of rides by it's driver:</p>
            {rides.length > 0 ? (
              <Rides rides={rides} />
            ) : (
              <p>No rides found</p>
            )}
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
}
