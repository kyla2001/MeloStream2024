// pages/playlist/index.js
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import CreatePlaylist from '../../components/CreatePlaylist';
import Playlist from '../../components/Playlist';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Playlist.module.css';


const PlaylistPage = () => {
    const { userId } = useAuth();
    const router = useRouter();

    // Handle unauthenticated user
    if (!userId) {
        return (
            <div className={styles.container}>
                <Head>
                    <title>MeloStream</title>
                    <meta name="description" content="A simple music streaming app" />
                    <link rel="icon" href='/assets/favicon.ico' />

                    <link
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
                    ></link>
                </Head>


                <div className={styles.container}>
                    <Navbar />
                    <main className={styles.main}>
                        <div style={{ marginTop: "300px", justifyContent: "center", display: "grid"}}>
                            <h1>You must be logged in to access this page.</h1>
                            <button style={{ marginTop: "50px"}} className="button is-light is-normal" onClick={() => router.push('/')}>Go to Home Page</button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Render page for authenticated users
    return (

        <div className={styles.container}>
            <Head>
                <title>MeloStream</title>
                <meta name="description" content="A simple music streaming app" />
                <link rel="icon" href="/assets/favicon.ico" />

                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
                ></link>
            </Head>

            <div className={styles.container}>
                <Navbar />
                <main className={styles.main}>
                    <div className={styles.playlistContainer}>
                        <h1 style={{ fontSize: "24px", marginTop: "100px", marginBottom: "-10px" }}>Create Playlist</h1>
                        <div className={styles.formRow}>
                            <CreatePlaylist />
                        </div>
                        <Playlist />
                    </div>
                </main>
            </div>
        </div>

    );
};

export default PlaylistPage;
