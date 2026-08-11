import React from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

export default function Select({ 
  label, 
  id, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Selecione uma opção',
  icon: Icon,
  fullWidth = true,
  disabled = false,
  error,
  ...props 
}) {
  return (
    <SelectGroup $fullWidth={fullWidth}>
      {label && <SelectLabel htmlFor={id}>{label}</SelectLabel>}
      <SelectWrapper $hasError={!!error} $disabled={disabled}>
        {Icon && (
          <IconWrapper>
            <Icon size={18} />
          </IconWrapper>
        )}
        <StyledSelectField
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </StyledSelectField>
        <ArrowWrapper>
          <ChevronDown size={18} />
        </ArrowWrapper>
      </SelectWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectGroup>
  );
}

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  margin-bottom: 1rem;
  text-align: left;
`;

const SelectLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const SelectWrapper = styled.div`
  position: relative;
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

const ArrowWrapper = styled.div`
  position: absolute;
  right: 0.85rem;
  pointer-events: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSelectField = styled.select`
  flex: 1;
  width: 100%;
  padding: 0.75rem 1.75rem 0.75rem 0;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--text-main);
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.775rem;
  color: var(--color-danger);
  font-weight: 500;
`;
