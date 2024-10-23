import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import SpotifyTracks from '../components/SpotifyTracks';
import styles from '../styles/Home.module.css';
import Comments from '../components/Comments';


const Home = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>MeloStream</title>
        <meta name="description" content="A simple music streaming app" />
        <link rel="icon" href='/assets/favicon.ico' />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
        />
      </Head>

      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.titleHeading}>
          Songs recommended by Yibei and Xuening, enjoy!
        </h1>
        <SpotifyTracks />
        <Comments />
      </main>
    </div>
  );
};

export default Home;