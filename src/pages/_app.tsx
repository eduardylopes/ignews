import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import '../styles/global.scss';
import { ApolloProvider } from '@apollo/client';
import { client } from '../services/apollo';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          <Header />
          <Component {...pageProps} />
        </ApolloProvider>
      </NextAuthProvider>
    </>
  );
}

export default MyApp;
