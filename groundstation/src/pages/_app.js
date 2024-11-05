import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-new.ico" />
        <title>Aero Design Ground Station</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
