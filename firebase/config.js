// firebase/config.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyChXjgDyRA4v8G36P1zMr7Ycwy-xRjkRYk",
    authDomain: "milestone-3-nobugsforever.firebaseapp.com",
    projectId: "milestone-3-nobugsforever",
    storageBucket: "milestone-3-nobugsforever.appspot.com",
    messagingSenderId: "889118885145",
    appId: "1:889118885145:web:bc407fea1e9fe1568fb188",
    measurementId: "G-XPFCB91KVW"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };