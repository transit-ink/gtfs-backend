import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { agenciesService } from '../services/agencies';
import { Agency } from '../types/gtfs';

interface AgencyContextType {
  agencies: Agency[];
  selectedAgency: Agency | null;
  selectAgency: (agency: Agency) => void;
  isLoading: boolean;
  error: string | null;
}

interface AgencyProviderProps {
  children: ReactNode;
}

const AgencyContext = createContext<AgencyContextType | null>(null);

export function AgencyProvider({ children }: AgencyProviderProps) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { api } = useAuth();

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await agenciesService.getAll();
        setAgencies(response);

        // Try to get the saved agency from localStorage
        const savedAgencyId = localStorage.getItem('selectedAgencyId');
        if (savedAgencyId) {
          const savedAgency = response.find(agency => agency.agency_id === savedAgencyId);
          if (savedAgency) {
            setSelectedAgency(savedAgency);
          }
        } else if (response.length > 0) {
          // If no saved agency, select the first one
          setSelectedAgency(response[0]);
        }
      } catch (err) {
        setError('Failed to load agencies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  const selectAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    localStorage.setItem('selectedAgencyId', agency.agency_id);
  };

  return (
    <AgencyContext.Provider value={{ agencies, selectedAgency, selectAgency, isLoading, error }}>
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
}
