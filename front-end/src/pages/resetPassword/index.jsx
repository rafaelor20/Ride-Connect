import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Lock, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import styled from 'styled-components';

import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import useResetPassword from '../../hooks/api/useResetPassword';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { resetPasswordLoading, resetPassword } = useResetPassword();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    if (!token || !password || !confirmPassword) {
      toast.error('Preencha todos os campos para continuar.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      toast.warning('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success('Senha redefinida com sucesso! Você já pode entrar.');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Erro ao redefinir senha';
      toast.error(`Falha: ${msg}`);
    }
  }

  return (
    <AuthLayout
      title="Criar Nova Senha"
      subtitle="Insira o código/token recebido e defina sua nova credencial de acesso"
    >
      <form onSubmit={submit}>
        <Input
          label="Código / Token de Validação"
          id="token-input"
          placeholder="Insira o token recebido"
          type="text"
          icon={KeyRound}
          fullWidth
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />

        <Input
          label="Nova Senha"
          id="new-password-input"
          placeholder="Mínimo 6 caracteres"
          type="password"
          icon={Lock}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirmar Nova Senha"
          id="confirm-new-password-input"
          placeholder="Repita a nova senha"
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
            loading={resetPasswordLoading}
            icon={CheckCircle2}
          >
            Redefinir Senha
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
