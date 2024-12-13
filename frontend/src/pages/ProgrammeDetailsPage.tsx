// frontend/src/pages/ProgrammeDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CommentsSection from '../components/CommentsSection';
import { Programme } from '../types/Programme';
import { apiRequest } from '../utils/api'; // Centralized API handler
import { useAuthState } from '../utils/secure'; // Authentication handler

const ProgrammeDetailsPage: React.FC = () => {
  const [programme, setProgramme] = useState<Programme | null>(null);
  const { cleanAuth } = useAuthState(); // Token management

  useEffect(() => {
    const fetchProgramme = async () => {
      const id = window.location.pathname.split('/').pop();
      try {
        const data: Programme = await apiRequest(`/programmes/${id}`, {}, cleanAuth);
        setProgramme(data);
      } catch (error) {
        console.error('Error fetching programme:', error);
      }
    };

    fetchProgramme();
  }, [cleanAuth]);

  if (!programme) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-info" role="alert">
            Loading programme details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">{programme.title}</h1>
        <div className="card">
          <div className="card-body">
            <p><strong>Presenter:</strong> {programme.presenter}</p>
            <p><strong>Type:</strong> {programme.type}</p>
            <p><strong>Languages:</strong> {programme.languages.join(', ')}</p>
            <p><strong>Date:</strong> {programme.dateline}</p>
            <p><strong>Duration:</strong> {programme.duration}</p>
            <p><strong>Price:</strong> {programme.price}</p>
            <p><strong>Description:</strong> {programme.description || 'No description available'}</p>
            <p><strong>Remarks:</strong> {programme.remarks || 'No remarks available'}</p>
            <p><strong>Enquiry:</strong> {programme.enquiry || 'No enquiry available'}</p>
            <p>
              <strong>Event URL:</strong>{' '}
              {programme.eventUrl ? (
                <a href={programme.eventUrl} target="_blank" rel="noopener noreferrer">
                  {programme.eventUrl}
                </a>
              ) : (
                'No event URL available'
              )}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CommentsSection programmeId={programme.event_id} />
        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetailsPage;
