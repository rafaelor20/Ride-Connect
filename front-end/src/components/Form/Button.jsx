import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  loading = false, 
  disabled = false, 
  icon: Icon,
  type = 'button',
  onClick,
  ...props 
}) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <SpinIcon size={18} />
          <span>Processando...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          <span>{children}</span>
        </>
      )}
    </StyledButton>
  );
}

const spinAnimation = keyframes`
  to { transform: rotate(360deg); }
`;

const SpinIcon = styled(Loader2)`
  animation: ${spinAnimation} 1s linear infinite;
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-family-display);
  font-weight: 600;
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};

  /* Sizes */
  ${(props) => {
    switch (props.$size) {
      case 'sm':
        return `
          padding: 0.45rem 0.85rem;
          font-size: 0.825rem;
        `;
      case 'lg':
        return `
          padding: 0.85rem 1.75rem;
          font-size: 1.05rem;
        `;
      default:
        return `
          padding: 0.7rem 1.25rem;
          font-size: 0.95rem;
        `;
    }
  }}

  /* Variants */
  ${(props) => {
    switch (props.$variant) {
      case 'secondary':
        return `
          background-color: var(--bg-surface-secondary);
          color: var(--text-main);
          border-color: var(--border-color);
          &:hover:not(:disabled) {
            background-color: var(--bg-surface-tertiary);
            border-color: var(--text-muted);
          }
        `;
      case 'success':
        return `
          background-color: var(--color-success);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          &:hover:not(:disabled) {
            background-color: #059669;
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
          }
        `;
      case 'danger':
        return `
          background-color: var(--color-danger-bg);
          color: var(--color-danger);
          border-color: var(--color-danger-border);
          &:hover:not(:disabled) {
            background-color: var(--color-danger);
            color: #ffffff;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--color-primary);
          border-color: var(--color-primary);
          &:hover:not(:disabled) {
            background-color: var(--color-primary-light);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: var(--text-secondary);
          &:hover:not(:disabled) {
            background-color: var(--bg-surface-secondary);
            color: var(--text-main);
          }
        `;
      case 'primary':
      default:
        return `
          background: var(--color-primary-gradient);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
          &:hover:not(:disabled) {
            opacity: 0.95;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;
