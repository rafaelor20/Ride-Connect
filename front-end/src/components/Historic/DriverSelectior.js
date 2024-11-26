import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverSelector = ({ drivers }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const navigate = useNavigate();

  //drivers may have repeated drivers, so we need to filter them using driver.name
  const uniqueDrivers = drivers.filter((driver, index, self) => self.findIndex((t) => t.name === driver.name) === index);

  const handleDriverChange = (event) => {
    const driverId = event.target.value;
    localStorage.setItem('driverId', driverId);
    navigate('/rides-by-driver');
  };

  return (
    <div>
      <label htmlFor="driver-select">Select a driver:</label>
      <select id="driver-select" value={selectedDriver} onChange={handleDriverChange}>
        <option value="">--Please choose a driver--</option>
        {uniqueDrivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DriverSelector;
