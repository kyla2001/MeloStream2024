import React from 'react';
import styles from '../styles/Comments.module.css';

const CommentCard = ({
    comment,
    onEdit,
    onDelete,
    canEdit,
    isEditing,
    editedComment,
    setEditedComment,
    saveEdit,
    cancelEdit
}) => {
    return (
        <li className={styles.commentItem}>
            <div>
                <p className={styles.commentText}>
                    {comment.userName}:
                </p>
                {isEditing ? (
                    <div>
                        <textarea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className={styles.inputField}
                        />
                        <div className={styles.commentActions}>
                            <button onClick={saveEdit} className="button is-small is-primary">Save</button>
                            <button onClick={cancelEdit} className="button is-small is-primary">Cancel</button>
                        </div>

                    </div>
                ) : (
                    <div style={{ display: "flex" }}>
                        <div>
                            <p className={styles.commentText}>
                                {comment.text}
                            </p>
                            <p className={styles.timestamp}>
                                Commented at: {comment.formattedTimestamp}
                            </p>
                        </div>

                        {canEdit && (
                            <div className={styles.commentActions}>
                                <button
                                    className="button is-small is-primary"
                                    onClick={() => onEdit(comment.id, comment.text)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="button is-small is-primary"
                                    onClick={() => onDelete(comment.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </li>
    );
};

export default CommentCard;
