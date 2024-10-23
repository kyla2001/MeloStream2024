// pages/api/playlist/[userId]/[playlistId]/songs.js
import { db } from '../../../../../firebase/config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
    const { userId, playlistId } = req.query;

    console.log("userId, playlistId", userId, playlistId);

    // Verify if the playlist exists
    const playlistRef = doc(db, `users/${userId}/playlists/${playlistId}`);
    const playlistDoc = await getDoc(playlistRef);

    if (!playlistDoc.exists()) {
        console.error("Playlist not found:", playlistId);
        return res.status(404).json({ error: 'Playlist not found' });
    }
    const songsRef = collection(db, `users/${userId}/playlists/${playlistId}/songs`);

    switch (req.method) {
        case 'POST': {
            const { trackName, artistName, albumName, albumArtUrl, previewUrl, liked } = req.body;
            try {
                const docRef = await addDoc(songsRef, {
                    trackName,
                    artistName,
                    albumName,
                    albumArtUrl,
                    previewUrl,
                    liked,
                    addedAt: serverTimestamp(),
                });
                res.status(201).json({ id: docRef.id, message: 'Song added successfully' });
            } catch (error) {
                console.error("Error adding song:", error);
                res.status(400).json({ error: error.message });
            }
            break;
        }
        case 'GET': {
            try {
                const snapshot = await getDocs(songsRef);
                const songs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                res.status(200).json(songs);
            } catch (error) {
                console.error("Error fetching songs:", error);
                res.status(500).json({ error: error.message });
            }
            break;
        }
        case 'PUT': {
            const { songId, newTrackName, newArtistName, newAlbumName, newAlbumArtUrl, newPreviewUrl, newLiked } = req.body;
            const songDocRef = doc(db, `users/${userId}/playlists/${playlistId}/songs/${songId}`);
            try {
                await updateDoc(songDocRef, {
                    trackName: newTrackName,
                    artistName: newArtistName,
                    albumName: newAlbumName,
                    albumArtUrl: newAlbumArtUrl,
                    previewUrl: newPreviewUrl,
                    liked: newLiked,
                    addedAt: serverTimestamp(),
                });
                res.status(200).json({ message: 'Song updated successfully' });
            } catch (error) {
                console.error("Error updating song:", error);
                res.status(400).json({ error: error.message });
            }
            break;
        }
        case 'DELETE': {
            const { songId } = req.body;
            const songDocRef = doc(db, `users/${userId}/playlists/${playlistId}/songs/${songId}`);
            try {
                await deleteDoc(songDocRef);
                res.status(200).json({ message: 'Song deleted successfully' });
            } catch (error) {
                console.error("Error deleting song:", error);
                res.status(400).json({ error: error.message });
            }
            break;
        }
        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
