import { collection, addDoc, getDocs, updateDoc, deleteDoc, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const commentsCollectionRef = collection(db, 'comments');
        const data = await getDocs(commentsCollectionRef);
        const comments = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        res.status(200).json(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error fetching comments' });
      }
      break;
    case 'POST':
      try {
        const { text, userId, userName } = req.body;
        console.log("POST: ",text, userId, userName  );
        const commentsCollectionRef = collection(db, 'comments');
        await addDoc(commentsCollectionRef, {
          text,
          userId,
          userName,
          timestamp: serverTimestamp(),
        });
        res.status(201).json({ message: 'Comment added successfully' });
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Error adding comment' });
      }
      break;
    case 'PUT':
      try {
        const { id, updatedText } = req.body;
        const commentDoc = doc(db, 'comments', id);
        await updateDoc(commentDoc, { text: updatedText });
        res.status(200).json({ message: 'Comment updated successfully' });
      } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Error updating comment' });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.body;
        const commentDoc = doc(db, 'comments', id);
        await deleteDoc(commentDoc);
        res.status(200).json({ message: 'Comment deleted successfully' });
      } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Error deleting comment' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
