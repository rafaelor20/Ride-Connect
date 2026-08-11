import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import styled from 'styled-components';

import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import useForgotPassword from '../../hooks/api/useForgotPassword';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { forgotPasswordLoading, forgotPassword } = useForgotPassword();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    if (!email) {
      toast.error('Informe seu e-mail cadastrado.');
      return;
    }

    try {
      await forgotPassword(email);
      toast.success('Instruções de recuperação enviadas para o seu e-mail!');
      navigate('/reset-password');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Erro ao solicitar redefinição';
      toast.error(`Falha: ${msg}`);
    }
  }

  return (
    <AuthLayout
      title="Recuperação de Senha"
      subtitle="Informe seu e-mail para receber as instruções e o código de recuperação"
    >
      <form onSubmit={submit}>
        <Input
          label="E-mail Cadastrado"
          id="email-input"
          placeholder="seu@email.com"
          type="email"
          icon={Mail}
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <SubmitSection>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={forgotPasswordLoading}
            icon={Send}
          >
            Enviar Código de Recuperação
          </Button>
        </SubmitSection>
      </form>

      <LinksContainer>
        <StyledBackLink to="/">
          <ArrowLeft size={16} />
          <span>Voltar para a tela de login</span>
        </StyledBackLink>
      </LinksContainer>
    </AuthLayout>
  );
}

const SubmitSection = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--border-color-light);
  padding-top: 1.25rem;
`;

const StyledBackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
`;
