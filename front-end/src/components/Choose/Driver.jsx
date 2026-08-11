import React from 'react';
import styled from 'styled-components';
import { Star, Car, User, MessageSquare, Check, ArrowRight } from 'lucide-react';

export default function Driver({ driver, onClick }) {
  const review = driver?.review && driver.review.length > 0 
    ? driver.review[0] 
    : { rating: 5, comment: 'Motorista excelente e pontual.' };

  const formattedPrice = Number(driver.value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <DriverCard onClick={onClick}>
      <CardTopRow>
        <DriverProfile>
          <AvatarWrapper>
            <User size={22} color="var(--color-primary)" />
          </AvatarWrapper>
          <DriverDetails>
            <DriverName>{driver.name}</DriverName>
            <VehicleBadge>
              <Car size={13} />
              <span>{driver.vehicle}</span>
            </VehicleBadge>
          </DriverDetails>
        </DriverProfile>

        <PriceSection>
          <PriceValue>{formattedPrice}</PriceValue>
          <PriceLabel>Preço final</PriceLabel>
        </PriceSection>
      </CardTopRow>

      {/* Description */}
      {driver.description && (
        <DescriptionText>{driver.description}</DescriptionText>
      )}

      {/* Rating & Review Snippet */}
      <ReviewBox>
        <RatingBadge>
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <RatingScore>{review.rating.toFixed(1)}</RatingScore>
          <ReviewCount>({driver.review?.length || 1} avaliações)</ReviewCount>
        </RatingBadge>
        
        {review.comment && (
          <CommentSnippet>
            <MessageSquare size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span>"{review.comment}"</span>
          </CommentSnippet>
        )}
      </ReviewBox>

      {/* Action Footer */}
      <SelectButtonWrapper>
        <SelectDriverBtn type="button">
          <span>Escolher este motorista</span>
          <ArrowRight size={16} />
        </SelectDriverBtn>
      </SelectButtonWrapper>
    </DriverCard>
  );
}

const DriverCard = styled.div`
  background-color: var(--bg-surface);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  transition: all var(--transition-fast);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--border-color-focus);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background-color: #fbfbfe;
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const DriverProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AvatarWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #c7d2fe;
`;

const DriverDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const DriverName = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
`;

const VehicleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.775rem;
  font-weight: 600;
  color: var(--text-secondary);
  background-color: var(--bg-surface-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  width: fit-content;
`;

const PriceSection = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const PriceValue = styled.span`
  font-family: var(--font-family-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-success);
  letter-spacing: -0.02em;
`;

const PriceLabel = styled.span`
  font-size: 0.725rem;
  color: var(--text-muted);
  font-weight: 500;
`;

const DescriptionText = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin: 0;
`;

const ReviewBox = styled.div`
  background-color: var(--bg-surface-secondary);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const RatingScore = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
`;

const ReviewCount = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const CommentSnippet = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.775rem;
  color: var(--text-secondary);
  font-style: italic;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SelectButtonWrapper = styled.div`
  margin-top: 0.25rem;
`;

const SelectDriverBtn = styled.button`
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: 1px solid var(--border-color-focus);
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all var(--transition-fast);

  ${DriverCard}:hover & {
    background: var(--color-primary-gradient);
    color: #ffffff;
    border-color: transparent;
  }
`;
