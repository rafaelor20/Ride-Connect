import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Page from '../../components/Page';
import { Container, Main, Content, CurrentAmount, ButtonsDiv } from '../../components/styles.js';
import TransactionContainer from '../../components/Home/TransactionHistory.js';
import RegisterButton from '../../components/Home/RegisterButton.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';

export default function Home() {
  return (
    <Page>
      <Container>
        <Header/>
        <Main>
          <Content>
            <div>
              getRide
            </div>
            <div>
              getHistoric
            </div>
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
