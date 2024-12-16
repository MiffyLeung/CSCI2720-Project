// frontend/src/pages/WhatsNewPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi'; // Centralized API handler
import LikeButton from '../components/LikeButton';
import './WhatsNewPage.css';

/**
 * A page to display the latest programmes sorted by release date.
 * Fetches programmes from the backend and renders them in a responsive grid layout.
 */
const WhatsNewPage: React.FC = () => {
    const navigate = useNavigate();
    const apiRequest = useApi(); // API handler
    const hasFetched = useRef(false); // Track whether data has already been fetched
    const abortController = useRef<AbortController | null>(null); // AbortController for fetch requests
    const [programmes, setProgrammes] = useState<Programme[]>([]);

    useEffect(() => {
        const fetchProgrammes = async () => {
            if (hasFetched.current) return; // Prevent repeated fetch
            hasFetched.current = true; // Mark as fetched

            if (abortController.current) {
                abortController.current.abort(); // Abort any existing requests
            }
            abortController.current = new AbortController();

            try {
                const data: Programme[] = await apiRequest('/programmes?sort=releaseDate_desc');
                setProgrammes(data);
            } catch (error) {
                console.error('Error fetching programmes:', error);
            }
        };

        fetchProgrammes();
    }, [apiRequest, hasFetched]);

    /**
     * Converts newline characters to <br /> tags.
     * @param {string} text - Text to convert.
     * @returns {React.JSX.Element[]} - Converted text with <br /> tags.
     */
    const nl2br = (text: string): React.JSX.Element[] => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    /**
     * Handles navigation to the ProgrammeDetailsPage.
     * @param eventId - The event ID of the selected programme.
     */
    const handleCardClick = (eventId: string) => {
        navigate(`/programme/${eventId}`);
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1 className="mb-4">What’s New</h1>
                <div className="row g-4">
                    {programmes.length > 0 ? (
                        programmes.map((programme) => (
                            <div
                                className="col-12 col-sm-6 col-lg-4 col-xxl-3"
                                key={programme.event_id}
                            >
                                <div
                                    className="card h-100 custom-card"
                                    onClick={() => handleCardClick(programme.event_id)}
                                >
                                    <div className="card-body">
                                        {/* Subject with 2-line truncation */}
                                        <h5
                                            className="card-title text-truncate-lines"
                                            style={{
                                                WebkitLineClamp: 2,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {programme.title}
                                        </h5>

                                        {/* Presenter */}
                                        <p className="text-muted small mb-2">{programme.presenter}</p>

                                        <hr />

                                        {/* Description (max 8 lines) */}
                                        <div
                                            className="text-truncate-lines mb-3"
                                            style={{
                                                WebkitLineClamp: 8,
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                display: '-webkit-box',
                                            }}
                                        >
                                            {nl2br(programme.description || 'No description available')}
                                        </div>

                                        {/* Duration, Price with Labels */}
                                        <p className="text-muted small mb-1">
                                            <strong>Duration:</strong> {programme.duration || 'N/A'}
                                        </p>
                                        <p className="text-muted small mb-2">
                                            <strong>Price:</strong> {programme.price || 'N/A'}
                                        </p>

                                        {/* Date, Venue, and Like Button */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="text-muted small mb-0">{programme.dateline}</p>
                                                <p className="text-muted small">
                                                    {programme.venue?.name || 'N/A'}
                                                </p>
                                            </div>
                                            <div
                                                onClick={(e) => e.stopPropagation()} // Prevent card click
                                            >
                                                <LikeButton
                                                    programmeId={programme.event_id}
                                                    initialLikes={programme.likes}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="alert alert-info" role="alert">
                            No new programmes available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WhatsNewPage;
