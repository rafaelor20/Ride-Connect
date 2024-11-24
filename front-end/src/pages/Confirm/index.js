import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Page from '../../components/Page';
import { Container, Main, Content, ButtonsDiv } from '../../components/styles.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';

export default function ConfirmRide() {
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
