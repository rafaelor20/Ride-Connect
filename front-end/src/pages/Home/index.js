import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import ToEstimate from '../../components/Home/toNextPage.js';
import Historic from '../../components/Home/historic.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';

export default function Home() {
  return (
    <Page>
      <Container>
        <Header/>
        <Main>
          <Content>
            <ToEstimate />
            <Historic />
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
