// frontend/src/pages/VenueDetailsPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../core/useApi';
import { Venue } from '../types/Venue';
import VenueMap from '../components/VenueMap';
import ToastStack, { ToastMessage } from '../components/ToastStack';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ArrowLeft, TagFill } from 'react-bootstrap-icons'; // Icons
import Navbar from '../components/Navbar';
import ProgrammeInfo from 'components/ProgrammeInfo';
import { formatUtcToLocalDateTime } from '../core/functions';


/**
 * Comment Interface
 */
interface Comment {
    content: string;
    author: string;
    date: string;
}

/**
 * VenueDetailsPage Component
 */
const VenueDetailsPage: React.FC = (): React.JSX.Element => {
    const { id } = useParams<{ id: string }>();
    const apiRequest = useApi();
    const navigate = useNavigate();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchVenue = async () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();
    
            try {
                // Send API request to get the venue details
                const responseData: Venue = await apiRequest(`/venue/${id}`, { 
                    method: 'GET' 
                }, abortControllerRef.current.signal);
    
                // Transform comments to include 'date' in 'YYYY-MM-DD HH:mm' format
                const formattedComments = responseData.comments.map((comment) => ({
                    ...comment,
                    date: formatUtcToLocalDateTime(comment.timestamp), // Extract and format date
                }));
    
                // Update the venue with transformed comments
                setVenue({
                    ...responseData,
                    comments: formattedComments,
                });
                setComments(formattedComments);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    addToast('Failed to load venue details.');
                    console.error('Error fetching venue:', error);
                }
            }
        };
    
        fetchVenue();
        return () => abortControllerRef.current?.abort(); // Cleanup
    }, [id, apiRequest]);
    
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            // Prepare the request payload
            const newCommentData = {
                content: newComment,
                author: 'Anonymous', // Default placeholder
                date: new Date().toISOString().split('T')[0],
            };

            // Send POST request to the API
            const responseData = await apiRequest(`/venue/${id}/comment`, {
                method: 'POST',
                body: JSON.stringify(newCommentData),
            });

            const formattedComment = {
                ...responseData,
                date: formatUtcToLocalDateTime(responseData.timestamp), // Convert timestamp to 'YYYY-MM-DD'
            };

            // Update comments state with transformed data
            setComments((prev) => [...prev, formattedComment]);

            // Clear input field
            setNewComment('');
            addToast('Comment added successfully!');
        } catch (error) {
            addToast('Failed to add comment.');
        }
    };


    const addToast = (text: string) => {
        const newToast = { id: Date.now(), text };
        setToastMessages((prev) => [...prev, newToast]);
    };

    const removeToast = (id: number) => {
        setToastMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    const goBack = () => navigate(-1);


    const [selectedProgramme, setSelectedProgramme] = useState<any | null>(null);

    if (!venue) return <p>Loading...</p>;

    return (
        <div>
            <Navbar />
            <Container className="p-5 rounded position-relative" style={{ backgroundColor: 'rgb(95 127 89 / 75%)' }}>
                {/* Back Button */}
                <Button
                    variant="light"
                    onClick={goBack}
                    className="position-absolute top-0 end-0 m-3 d-flex align-items-center btn-dark"
                >
                    <ArrowLeft className="me-2" />
                    Back
                </Button>

                <h1 className="pb-3 text-truncate">{venue.name}</h1>
                <Row>
                    {/* Location Details */}
                    <Col xs="12" md={venue.latitude && venue.longitude ? 6 : 12}>
                        <div className="mb-2">
                            <h3 className="fw-bold">Location Details</h3>
                            {venue.latitude && venue.longitude ? (
                                <p className="text-truncate">
                                    Coordinates: ({venue.latitude}, {venue.longitude})
                                </p>
                            ) : (
                                <h4 className="text-warning fw-bold text-center mb-2">Location data not available for this venue.</h4>
                            )}
                        </div>
                        <hr />

                        {/* Programmes Section */}
                        <div className="mb-2">
                            <h3 className="fw-bold">Programmes</h3>
                            {venue.programmes.length > 0 ? (
                                venue.programmes.map((programme, idx) => {
                                    // Set parent venue to programme
                                    const updatedProgramme =
                                        typeof programme === 'string'
                                            ? { event_id: programme, venue: venue } // Minimal object when programme is a string
                                            : { ...programme, venue: venue }; // Add venue to programme if it's an object
                                    return (
                                        <div
                                            key={idx}
                                            role="button"
                                            onClick={() => setSelectedProgramme(updatedProgramme)}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#FFF3'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'unset'}
                                            className="mb-2 d-flex align-items-center rounded shadow-sm p-2" // Added class for hover
                                            style={{ transition: 'background-color 0.3s ease' }} // Smooth transition
                                        > <div className="w-100 p-2">
                                                <div className="mb-0 text-truncate h5">
                                                    <div
                                                        className="text-decoration-none d-flex"
                                                    >
                                                        {typeof programme === 'string' ? programme : programme.title}

                                                    </div>
                                                </div>
                                                {typeof programme !== 'string' && (
                                                    <p className="text-warning mb-0 small text-truncate d-flex w-100">
                                                        <TagFill className="text-info mt-1 me-1" />
                                                        {programme.dateline}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                )
                            ) : (
                                <p>No programmes available</p>
                            )}
                        </div>
                        <hr />

                        {/* Comments Section */}
                        <div className="mb-2">
                            <h3 className="fw-bold">Comments</h3>
                            <div className="mb-3">
                                {comments.length > 0 ? (
                                    comments.map((comment, idx) => (
                                        <div key={idx} className="mb-2 border-dark shadow p-3 rounded" style={{ backgroundColor: '#e6fff433' }}>
                                            <p className="mb-1">{comment.content}</p>
                                            <p className="text-warning text-end mb-0 small">
                                                {comment.author} - {comment.date}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments available.</p>
                                )}
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                />
                                <button className="btn btn-success" onClick={handleAddComment}>
                                    Add Comment
                                </button>
                            </div>
                        </div>
                    </Col>
                    {/* Map View */}
                    {venue.latitude && venue.longitude && (
                        <Col xs="12" md="6">
                            <div style={{ minHeight: '450px', marginBottom: '20px' }}>
                                <VenueMap
                                    type="One"
                                    venues={[venue]}
                                    onMarkerClick={() => { }}
                                    renderPopup={() => <span>{venue.name}</span>}
                                />
                            </div>
                        </Col>
                    )}
                </Row>
                {/* Toast Messages */}
                <ToastStack messages={toastMessages} onRemove={removeToast} />

                {selectedProgramme && (
                    <ProgrammeInfo
                        programme={selectedProgramme}
                        onClose={() => setSelectedProgramme(null)}
                        show={true} // Add the required show prop
                    />
                )}

            </Container>
        </div>
    );
};

export default VenueDetailsPage;
