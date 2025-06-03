import React from 'react';
import styled from 'styled-components';

const Input = ({ label, type, value, onChange }) => {
  return (
    <div>
      <StyledInput placeholder={label} type={type} value={value} onChange={onChange} autoComplete="on" />
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
  /* Autocomplete styles for Chrome */
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: black !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  /* Autocomplete styles for Firefox */
  &:-moz-autofill {
    box-shadow: 0 0 0 1000px white inset !important;
    -moz-text-fill-color: black !important;
  }
`;
