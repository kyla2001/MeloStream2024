// pages/api/playlist/[userId]/index.js
import { db } from '../../../../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
    console.log(`Received ${req.method} request on ${req.url}`);

    const { userId } = req.query;

    // Verify if the user exists
    const userRef = doc(db, `users/${userId}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        console.error("User not found:", userId);
        return res.status(404).json({ error: 'User not found' });
    }
    const playlistsRef = collection(db, `users/${userId}/playlists`);

    switch (req.method) {
        case 'POST':
            const { title, description } = req.body;
            try {
                const docRef = await addDoc(playlistsRef, {
                    title,
                    description,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                console.log("Document written with ID: ", docRef.id);
                res.status(201).json({ id: docRef.id });
            } catch (error) {
                console.error("Error creating playlist:", error);
                res.status(400).json({ error: error.message });
            }
            break;

        case 'GET':
            try {
                const snapshot = await getDocs(playlistsRef);
                const playlists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                res.status(200).json(playlists);
            } catch (error) {
                console.error("Error fetching playlists:", error);
                res.status(500).json({ error: error.message });
            }
            break;

        case 'PUT':
            const { playlistId, newTitle, newDescription } = req.body;
            const playlistDocRef = doc(db, `users/${userId}/playlists/${playlistId}`);
            try {
                await updateDoc(playlistDocRef, {
                    title: newTitle,
                    description: newDescription,
                    updatedAt: serverTimestamp()
                });
                res.status(200).json({ message: 'Playlist updated successfully' });
            } catch (error) {
                console.error("Error updating playlist:", error);
                res.status(400).json({ error: error.message });
            }
            break;

        case 'DELETE':
            try {
                await deleteDoc(doc(db, `users/${userId}/playlists/${req.body.playlistId}`));
                res.status(200).json({ message: 'Playlist deleted successfully' });
            } catch (error) {
                console.error("Error deleting playlist:", error);
                res.status(400).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
