import Page from '../../components/Page';
import { Container, Main, Content } from '../../components/styles.js';
import ToNextPage from '../../components/Home/toNextPage.js';
import Header from '../../components/Home/Header.js';
import Footer from '../../components/Footer.js';

export default function Home() {
  return (
    <Page>
      <Container>
        <Header/>
        <Main>
          <Content>
            <ToNextPage nextPage="/estimate" description="Get a new ride!" />
            <ToNextPage nextPage="/rides" description="Get historic of rides" />
          </Content>
        </Main>
        <Footer />
      </Container>
    </Page>
  );
};
