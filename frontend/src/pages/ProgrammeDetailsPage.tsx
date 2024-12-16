// frontend/src/pages/ProgrammeDetailsPage.tsx

import React, { useEffect, useState, JSX } from 'react';
import Navbar from '../components/Navbar';
import CommentsSection from '../components/CommentsSection';
import LikeButton from '../components/LikeButton';
import MapButton from '../components/MapButton';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

/**
 * A page to display detailed information about a specific programme.
 *
 * @component
 * @example
 * <ProgrammeDetailsPage />
 */
const ProgrammeDetailsPage: React.FC = () => {
    const [programme, setProgramme] = useState<Programme | null>(null); // State to store programme details
    const apiRequest = useApi(); // API request hook
    const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate fetches

    useEffect(() => {
        /**
         * Fetch the programme details by ID from the API.
         */
        const fetchProgramme = async () => {
            if (hasFetched) return;

            const id = window.location.pathname.split('/').pop(); // Extract ID from URL
            if (!id) {
                console.error('Programme ID not found in URL');
                return;
            }

            try {
                const data: Programme = await apiRequest(`/programme/${id}`);
                setProgramme(data); // Update the programme state
                setHasFetched(true); // Mark as fetched
            } catch (error) {
                console.error('Error fetching programme:', error);
            }
        };

        fetchProgramme();
    }, [apiRequest, hasFetched]);

    // Render loading state if programme data is not available
    if (!programme) {
        return (
            <div>
                <Navbar />
                <Container className="mt-5">
                    <div className="alert alert-info">Loading programme details...</div>
                </Container>
            </div>
        );
    }

    /**
     * Converts newline characters to <br /> tags for text formatting.
     *
     * @param {string} text - The text to process.
     * @returns {JSX.Element[]} - The processed text with <br /> tags.
     */
    const nl2br = (text: string): JSX.Element[] => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div>
            <Navbar />
            <Container className="mt-5">
                {/* Title Section with Like Button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold w-100" style={{ wordWrap: 'break-word' }}>
                        {programme.title}
                        <LikeButton programmeId={programme.event_id} initialLikes={programme.likes} />
                    </h1>
                </div>

                {/* Programme Details */}
                <Card className="shadow-sm border-0 mb-4" style={{background:'linear-gradient(135deg, #def8c4, #8be6c6)'}}>
                    <Card.Body>
                        <p>
                            <strong>Presenter:</strong> {programme.presenter || 'N/A'}
                        </p>
                        <p>
                            <strong>Type:</strong> {programme.type || 'N/A'}
                        </p>
                        <p>
                            <strong>Date:</strong> {programme.dateline || 'N/A'}
                        </p>
                        <p>
                            <strong>Duration:</strong> {programme.duration || 'N/A'}
                        </p>
                        <p>
                            <strong>Price:</strong> {programme.price || 'N/A'}
                        </p>
                        <p>
                            <strong>Description:</strong>{' '}
                            {programme.description ? nl2br(programme.description) : 'No description available'}
                        </p>
                        <p>
                            <strong>Remarks:</strong> {programme.remarks || 'No remarks available'}
                        </p>
                        <p>
                            <strong>Enquiry:</strong> {programme.enquiry || 'No enquiry available'}
                        </p>
                        <p>
                            <strong>Venue:</strong>{' '}
                            {programme.venue?.name ? (
                                <>
                                    {programme.venue.name}
                                    {programme.venue.latitude && programme.venue.longitude && (
                                        <span className="ms-2">
                                            <MapButton
                                                venueName={programme.venue.name}
                                                latitude={programme.venue.latitude}
                                                longitude={programme.venue.longitude}
                                            />
                                        </span>
                                    )}
                                </>
                            ) : (
                                'Not specified'
                            )}
                        </p>
                        <p>
                            <strong>Event URL:</strong>{' '}
                            {programme.eventUrl ? (
                                <a
                                    href={programme.eventUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {programme.eventUrl}
                                </a>
                            ) : (
                                'No event URL available'
                            )}
                        </p>
                    </Card.Body>
                </Card>

                {/* Comments Section */}
                <CommentsSection
                    initialComments={programme.comments || []} // Default to empty array
                    programmeId={programme.event_id}
                />

            </Container>
        </div>
    );
};

export default ProgrammeDetailsPage;
