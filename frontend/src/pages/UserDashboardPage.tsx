// frontend/src/pages/UserDashboardPage.tsx

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProgrammeList from '../components/ProgrammeList';
import { Programme } from '../types/Programme';
import { useApi } from '../core/useApi';
import { useAuth } from '../core/AuthContext';

/**
 * The UserDashboardPage displays a list of programmes available to the user.
 * Users can view detailed information about a programme in a modal.
 */
const UserDashboardPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const apiRequest = useApi();
  const { isAuthenticated } = useAuth();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
        /**
         * Fetch programmes from the API.
         * Ensures data is fetched only once and the user is authenticated.
         */
    const fetchProgrammes = async () => {
      if (!isAuthenticated || hasFetched) return;

      try {
        const data: Programme[] = await apiRequest('/programmes');
        setProgrammes(data);
        setHasFetched(true);
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, [isAuthenticated, apiRequest, hasFetched]);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">User Dashboard</h1>
        <ProgrammeList programmes={programmes} />
      </div>
    </div>
  );
};

export default UserDashboardPage;
