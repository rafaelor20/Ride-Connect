import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Page from '../../components/Page';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import { Container, Row, Title, Label, MainRow } from '../../components/Auth';
import Link from '../../components/Link';
import Footer from '../../components/Footer';
import useForgotPassword from '../../hooks/api/useForgotPassword';

import logo from '../../assets/logo.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { forgotPasswordLoading, forgotPassword } = useForgotPassword();

  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    if ( !email ) {
      toast('Email are required!');
    } else {
      try {
        await forgotPassword( email );
        toast('Email sent!');
        navigate('/reset-password');
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
              label="E-mail"
              type="text"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" color="primary" fullWidth disabled={forgotPasswordLoading}>
                Reset Password
            </Button>
          </form>
        </MainRow>
        <Row>
          <Link to="/"><p>return to login page</p></Link>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </Page>
  );
}
