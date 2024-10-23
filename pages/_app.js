// pages/_app.js
import React from 'react';
import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext';
import { Analytics } from "@vercel/analytics/react"

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
            <Analytics />
        </AuthProvider>
    );
}

export default MyApp;
