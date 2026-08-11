import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, UserPlus, LogIn, HelpCircle } from 'lucide-react';
import styled from 'styled-components';

import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import useSignUp from '../../hooks/api/useSignUp';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { loadingSignUp, signUp } = useSignUp();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Todos os campos são obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      toast.warning('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    try {
      await signUp(name, email, password);
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Erro ao realizar cadastro';
      toast.error(`Falha no cadastro: ${msg}`);
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Cadastre-se para aproveitar as melhores opções de viagens e motoristas"
    >
      <form onSubmit={submit}>
        <Input
          label="Nome Completo"
          id="name-input"
          placeholder="Ex: Carlos Silva"
          type="text"
          icon={User}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          placeholder="Mínimo 6 caracteres"
          type="password"
          icon={Lock}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirmar Senha"
          id="confirm-password-input"
          placeholder="Repita sua senha"
          type="password"
          icon={ShieldCheck}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <SubmitSection>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loadingSignUp}
            icon={UserPlus}
          >
            Finalizar Cadastro
          </Button>
        </SubmitSection>
      </form>

      <LinksContainer>
        <NavRow>
          <PromptText>Já possui uma conta?</PromptText>
          <StyledActionLink to="/">
            <LogIn size={15} />
            <span>Fazer login</span>
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
