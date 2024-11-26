import Page from '../../components/Page.js';
import { Container, Main, Content } from '../../components/styles.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';
import Link from '../../components/Link.js';

import Drivers from '../../components/Choose/Drivers.js';

export default function ChooseDriver() {
  return (
    <Page>
      <Container>
        <Header/>
        <Main>
          <Content>
            <Link to="/estimate">
              <button >Return to estimateRide</button>
            </Link>
            <Drivers />
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
