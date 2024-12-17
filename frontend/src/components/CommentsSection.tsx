// frontend/src/components/CommentsSection.tsx

import React, { useState } from 'react';
import { useApi } from '../core/useApi'; // Centralized API handler
import { Comment } from '../types/Comment';

/**
 * Props for the CommentsSection component.
 */
interface CommentsSectionProps {
    initialComments?: Comment[]; // Optional to avoid undefined issues
    programmeId: string; // Programme ID for submitting comments
}

/**
 * A section to display and add comments for a programme.
 * 
 * @param {CommentsSectionProps} props - Props for the component.
 * @returns {JSX.Element} The comments section.
 */
const CommentsSection: React.FC<CommentsSectionProps> = ({ initialComments = [], programmeId }) => {
    const [comments, setComments] = useState<Comment[]>(initialComments); // Initialize with empty array if undefined
    const [newComment, setNewComment] = useState(''); // State for the new comment text
    const [isSubmitting, setIsSubmitting] = useState(false); // State to disable the submit button while submitting
    const apiRequest = useApi(); // Hook for API requests

    /**
     * Handles adding a new comment.
     * Sends the new comment to the API and updates the comment list.
     */
    const handleAddComment = async () => {
        if (!newComment.trim()) return; // Ignore empty comments

        setIsSubmitting(true); // Disable button during submission

        try {
            const data: Comment = await apiRequest(`/programme/${programmeId}/comments`, {
    
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newComment }), // Send the comment text
            });
console.log("hi");
            setComments((prevComments) => [...prevComments, data]); // Add the new comment to the list
            setNewComment(''); // Clear the input
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false); // Re-enable the button
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            <ul className="list-group mb-3">
                {/* Render each comment */}
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <li key={comment.id} className="list-group-item">
                            <strong>{comment.account}:</strong> {comment.text}
                            <div className="text-muted small">
                                {new Date(comment.createdAt).toLocaleString()}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-muted">No comments yet.</li>
                )}
            </ul>
            <textarea
                className="form-control mb-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                rows={4}
                disabled={isSubmitting} // Disable input when submitting
            />
            <button
                className="btn btn-success"
                onClick={handleAddComment}
                disabled={isSubmitting || !newComment.trim()} // Disable if empty or submitting
            >
                {isSubmitting ? 'Submitting...' : 'Add Comment'}
            </button>
        </div>
    );
};

export default CommentsSection;
