import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, HelpCircle } from 'lucide-react';
import styled from 'styled-components';

import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import UserContext from '../../contexts/UserContext';
import useSignIn from '../../hooks/api/useSignIn';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loadingSignIn, signIn } = useSignIn();
  const { setUserData } = useContext(UserContext);

  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Preencha todos os campos para continuar.');
      return;
    }

    try {
      const userData = await signIn(email, password);
      setUserData(userData);
      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao realizar login';
      toast.error(`Falha no login: ${msg}`);
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta!"
      subtitle="Acesse sua conta para solicitar e gerenciar suas viagens"
    >
      <form onSubmit={submit}>
        <Input
          label="E-mail"
          id="email-input"
          placeholder="seu@email.com"
          type="email"
          icon={Mail}
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Senha"
          id="password-input"
          placeholder="••••••••"
          type="password"
          icon={Lock}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <SubmitSection>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loadingSignIn}
            icon={LogIn}
          >
            Entrar na Plataforma
          </Button>
        </SubmitSection>
      </form>

      <LinksContainer>
        <NavRow>
          <PromptText>Não tem uma conta?</PromptText>
          <StyledActionLink to="/sign-up">
            <UserPlus size={15} />
            <span>Criar conta agora</span>
          </StyledActionLink>
        </NavRow>

        <NavRow style={{ marginTop: '0.75rem' }}>
          <StyledSecondaryLink to="/forgot-password">
            <HelpCircle size={14} />
            <span>Esqueceu sua senha?</span>
          </StyledSecondaryLink>
        </NavRow>
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
  flex-direction: column;
  align-items: center;
  border-top: 1px solid var(--border-color-light);
  padding-top: 1.25rem;
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const PromptText = styled.span`
  color: var(--text-muted);
`;

const StyledActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }
`;

const StyledSecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--text-muted);
  font-size: 0.825rem;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: var(--text-main);
    text-decoration: underline;
  }
`;
