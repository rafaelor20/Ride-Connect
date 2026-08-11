import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default styled(Link)`
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }

  p {
    margin: 0;
    color: inherit;
    font-size: inherit;
  }
`;
