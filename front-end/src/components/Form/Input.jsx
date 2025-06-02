import React from 'react';
import styled from 'styled-components';

const Input = ({ label, type, value, onChange }) => {
  return (
    <div>
      <StyledInput placeholder={label} type={type} value={value} onChange={onChange} />
    </div>
  );
};

export default Input;

const StyledInput = styled.input`
  min-width: 250px;
  border-radius: 5px;
  background-color: white;
  color: black;
  ::placeholder {
    color: black;
  }
`;
