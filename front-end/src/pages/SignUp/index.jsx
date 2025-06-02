import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Page from '../../components/Page';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import { Container, Row, Title, Label, MainRow } from '../../components/Auth';
import Link from '../../components/Link';
import Footer from '../../components/Footer';
import useSignUp from '../../hooks/api/useSignUp';

import logo from '../../assets/logo.png';

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
      toast('All fields are required!');
    } else if (password !== confirmPassword) {
      toast('Passwords do not match!');
    } else {
      try {
        await signUp(name, email, password);
        toast('User created!');
        navigate('/');
      } catch (error) {
        toast('Something is wrong!, ' + error.message);
      }
    }
  }

  return (
    <Page>
      <Container>
        <Row>
          <img src={logo} alt="Ride Connect Logo" width="140px" />
          <Title>Ride Connect</Title>
        </Row>
        <MainRow>
          <form onSubmit={submit}>
            <Input
              label="Username"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="E-mail"
              type="text"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Password again"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" color="primary" fullWidth disabled={loadingSignUp}>
              SUBSCRIBE
            </Button>
          </form>
        </MainRow>
        <Row>
          <Link to="/">Already subscribed?</Link>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </Page>
  );
}

