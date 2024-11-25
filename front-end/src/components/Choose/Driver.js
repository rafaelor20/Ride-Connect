import styled from 'styled-components';

export default function Driver(props) {
  return (
    <div>
      <h1>Driver:</h1>
      <p>Driver's name: {props.name}</p>
      <p>Value: {props.value}</p>
    </div>);
}
