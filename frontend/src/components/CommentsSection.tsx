// frontend/src/components/CommentsSection.tsx

import React, { useEffect, useState } from 'react';
import { useApi } from '../core/useApi'; // Centralized API handler
import { useAuth } from '../core/AuthContext'; // Authentication handler

interface Comment {
    id: string;
    text: string;
    account: string;
    createdAt: string;
}

interface CommentsSectionProps {
    programmeId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ programmeId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const apiRequest = useApi(); // Use centralized API handler
    const { isAuthenticated } = useAuth(); // Check authentication status

    useEffect(() => {
        const fetchComments = async () => {
            if (!isAuthenticated) {
                console.error('User is not authenticated');
                return;
            }

            try {
                const data: Comment[] = await apiRequest(`/programmes/${programmeId}/comments`);
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [programmeId, isAuthenticated, apiRequest]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const data: Comment = await apiRequest(`/programmes/${programmeId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newComment }),
            });

            setComments([...comments, data]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            <ul className="list-group mb-3">
                {comments.map((comment) => (
                    <li key={comment.id} className="list-group-item">
                        <strong>{comment.account}:</strong> {comment.text}
                        <div className="text-muted small">
                            {new Date(comment.createdAt).toLocaleString()}
                        </div>
                    </li>
                ))}
            </ul>
            <textarea
                className="form-control mb-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                rows={4}
            />
            <button className="btn btn-primary" onClick={handleAddComment}>
                Add Comment
            </button>
        </div>
    );
};

export default CommentsSection;
