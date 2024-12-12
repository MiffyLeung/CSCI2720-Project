// src/components/CommentsSection.tsx
import React, { useEffect, useState } from 'react';

interface Comment {
  id: string;
  text: string;
  user: string;
}

interface CommentsSectionProps {
  locationId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ locationId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');
  const REACT_APP_API = process.env.REACT_APP_API || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${REACT_APP_API}/locations/${locationId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [locationId, token, REACT_APP_API]);

  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      const response = await fetch(`${REACT_APP_API}/locations/${locationId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]);
        setNewComment('');
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.user}:</strong> {comment.text}
          </li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default CommentsSection;
