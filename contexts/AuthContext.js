import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null); // New userId state

    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Set the user ID from the authenticated user
                setUser(user);

                // Update user profile in Firestore if needed
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL || null,
                }, { merge: true });

                // Set the userId state
                setUserId(user.uid);
            } else {
                // Clear the user ID when there is no authenticated user
                setUser(null);
                setUserId(null);
            }
            setLoading(false);
        });

        // Clean up the subscription on component unmount
        return () => unsubscribe();
    }, []);

    // Function to handle Google sign-in
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed: ' + error.message);
        }
    };

    // Function to handle sign-out
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error('Logout failed: ' + error.message);
        }
    };

    const value = {
        user,
        loading,
        userId, // Include userId in the value object
        loginWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context values
export const useAuth = () => {
    return useContext(AuthContext);
};
