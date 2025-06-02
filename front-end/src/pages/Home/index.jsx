import Page from '../../components/Page.jsx';
import { Container, Main, Content } from '../../components/styles';
import ToNextPage from '../../components/Home/toNextPage';
import Header from '../../components/Home/Header.jsx';
import Footer from '../../components/Footer.jsx';

export default function Home() {
  return (
    <Page>
      <Container>
        <Main>
          <Header/>
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
