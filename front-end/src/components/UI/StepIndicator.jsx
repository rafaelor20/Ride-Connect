import React from 'react';
import styled from 'styled-components';
import { MapPin, UserCheck, CheckCircle2 } from 'lucide-react';

export default function StepIndicator({ currentStep = 1 }) {
  const steps = [
    { step: 1, label: 'Trajeto', icon: MapPin },
    { step: 2, label: 'Motorista', icon: UserCheck },
    { step: 3, label: 'Confirmação', icon: CheckCircle2 },
  ];

  return (
    <IndicatorContainer>
      {steps.map((item, index) => {
        const Icon = item.icon;
        const isCompleted = currentStep > item.step;
        const isCurrent = currentStep === item.step;

        return (
          <React.Fragment key={item.step}>
            <StepItem $isCompleted={isCompleted} $isCurrent={isCurrent}>
              <StepCircle $isCompleted={isCompleted} $isCurrent={isCurrent}>
                {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </StepCircle>
              <StepLabel $isCompleted={isCompleted} $isCurrent={isCurrent}>
                {item.label}
              </StepLabel>
            </StepItem>
            {index < steps.length - 1 && (
              <StepConnector $isCompleted={currentStep > item.step} />
            )}
          </React.Fragment>
        );
      })}
    </IndicatorContainer>
  );
}

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 480px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
  box-sizing: border-box;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  z-index: 2;
`;

const StepCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all var(--transition-normal);

  ${(props) => {
    if (props.$isCompleted) {
      return `
        background-color: var(--color-success);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
      `;
    }
    if (props.$isCurrent) {
      return `
        background: var(--color-primary-gradient);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
        transform: scale(1.05);
      `;
    }
    return `
      background-color: var(--bg-surface-tertiary);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
    `;
  }}
`;

const StepLabel = styled.span`
  font-size: 0.8rem;
  font-weight: ${(props) => (props.$isCurrent ? '700' : '500')};
  color: ${(props) => {
    if (props.$isCurrent) return 'var(--color-primary)';
    if (props.$isCompleted) return 'var(--text-main)';
    return 'var(--text-muted)';
  }};
  white-space: nowrap;
`;

const StepConnector = styled.div`
  flex: 1;
  height: 2px;
  margin: 0 0.5rem 1.25rem;
  background-color: ${(props) =>
    props.$isCompleted ? 'var(--color-success)' : 'var(--border-color)'};
  transition: background-color var(--transition-normal);
`;
