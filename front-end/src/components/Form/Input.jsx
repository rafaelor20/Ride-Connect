import React from 'react';
import styled from 'styled-components';

export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  icon: Icon,
  error,
  id,
  fullWidth = true,
  disabled = false,
  ...props 
}) {
  return (
    <InputGroup $fullWidth={fullWidth}>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <InputWrapper $hasError={!!error} $disabled={disabled}>
        {Icon && (
          <IconWrapper>
            <Icon size={18} />
          </IconWrapper>
        )}
        <StyledInputField
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          disabled={disabled}
          autoComplete="on"
          {...props}
        />
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputGroup>
  );
}

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  margin-bottom: 1rem;
  text-align: left;
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--bg-surface);
  border: 1.5px solid ${(props) => (props.$hasError ? 'var(--color-danger)' : 'var(--border-color)')};
  border-radius: var(--radius-lg);
  padding: 0 0.85rem;
  transition: all var(--transition-fast);
  box-sizing: border-box;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:focus-within {
    border-color: ${(props) => (props.$hasError ? 'var(--color-danger)' : 'var(--border-color-focus)')};
    box-shadow: 0 0 0 3px ${(props) => (props.$hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(79, 70, 229, 0.15)')};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-right: 0.6rem;
`;

const StyledInputField = styled.input`
  flex: 1;
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--text-main);

  &::placeholder {
    color: var(--text-light);
  }

  &:focus {
    outline: none;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: var(--text-main) !important;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.775rem;
  color: var(--color-danger);
  font-weight: 500;
`;
