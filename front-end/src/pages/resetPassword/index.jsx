import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Page from '../../components/Page';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import { Container, Row, Title, Label, MainRow } from '../../components/Auth';
import Link from '../../components/Link';
import Footer from '../../components/Footer';
import useResetPassword from '../../hooks/api/useResetPassword';

import logo from '../../assets/logo.png';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');

  const { resetPasswordLoading, resetPassword } = useResetPassword();

  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    if (  !token || !password || !confirmPassword ) {
      toast('All fields are required!');
    } else if ( password !== confirmPassword ) {
      toast('Passwords do not match!');
    } else {
      try {
        await resetPassword( token, password);
        toast('Password reset successful!');
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
              label="Token"
              type="text"
              fullWidth
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" color="primary" fullWidth disabled={resetPasswordLoading}>
              Reset Password
            </Button>
          </form>
        </MainRow>
        <Row>
          <Link to="/"><p>Already subscribed?</p></Link>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </Page>
  );
}
