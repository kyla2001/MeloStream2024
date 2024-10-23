import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import PlaylistDetails from '../../components/PlaylistDetails';
import Head from 'next/head';


function PlaylistPage() {
    const router = useRouter();
    const { playlistId } = router.query;

    return (
        <div>
            <Navbar />
            {playlistId && <PlaylistDetails playlistId={playlistId} />}
        </div>
    );
}

export default PlaylistPage;
