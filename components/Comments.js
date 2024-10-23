import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CommentCard from './CommentCard';
import styles from '../styles/Comments.module.css';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const { user, loginWithGoogle, logout } = useAuth();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      const data = await response.json();
      if (response.ok) {
        const sortedComments = data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setComments(sortedComments.map(comment => ({
          ...comment,
          formattedTimestamp: formatTimestamp(comment.timestamp)
        })));
      } else {
        throw new Error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async () => {
    if (!user) {
      alert('Please log in to add a comment.');
      return;
    }
    const commentData = {
      text: newComment,
      userId: user.uid,
      userName: user.displayName
    };
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = (id, text) => {
    console.log("Call on edit: ", id, text);
    setEditingCommentId(id);
    setEditedComment(text);
  };

  const saveEditComment = async () => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCommentId, updatedText: editedComment })
      });
      if (response.ok) {
        setEditingCommentId(null);
        setEditedComment('');
        fetchComments();
      } else {
        throw new Error('Failed to edit comment');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const removeComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        fetchComments();
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString();
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <div className={styles.commentsHeader}>
        {user ? (
          <>
            <span>Leave a comment as {user.displayName}</span>
            <button style={{ marginLeft: "50px" }} onClick={logout} className="button is-normal is-light">Logout</button>
          </>
        ) : (
          <button onClick={loginWithGoogle} className="button is-normal is-light">Login to Add Comments</button>
        )}
        {user && (
          <div className={styles.commentInput}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.inputField}
            />
            <button onClick={addComment} className="button is-small is-primary">Add Comment</button>
          </div>
        )}
      </div>
      <div className={styles.commentsContainer}>
        <ul className={styles.commentsList}>
          {comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              formattedTimestamp={comment.formattedTimestamp}
              onEdit={handleEditComment}
              onDelete={removeComment}
              canEdit={user && user.uid === comment.userId}
              isEditing={editingCommentId === comment.id}
              editedComment={editedComment}
              setEditedComment={setEditedComment}
              saveEdit={saveEditComment}
              cancelEdit={() => {
                setEditingCommentId(null);
                setEditedComment('');
              }}
            />


          ))}
        </ul>
      </div>
    </div>
  );
};

export default Comments;
