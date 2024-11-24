import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';

export default function HistoricByDriver() {
  return (
    <Page>
      <Container>
        <Header />
        <Main>
          <Content>
            <h1>HistoricByDriver</h1>
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
}
