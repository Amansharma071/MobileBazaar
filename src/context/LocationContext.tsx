import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserLocation } from '../types/index.js';
import { api } from '../lib/api.js';

interface LocationContextType {
  location: UserLocation | null;
  loading: boolean;
  showPrompt: boolean;
  setShowPrompt: (show: boolean) => void;
  requestBrowserLocation: () => Promise<boolean>;
  setCityManually: (city: string, state: string) => Promise<void>;
  disableLocation: () => Promise<void>;
  dismissPrompt: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const loc = await api.getLocation();
        setLocation(loc);
        // If not granted and not previously dismissed in this session, we can politely provide a prompt
        const dismissed = sessionStorage.getItem('amazon_mobile_loc_dismissed');
        if (!loc.permissionGranted && !dismissed) {
          setShowPrompt(false); // only show when user clicks or explicitly navigates
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoc();
  }, []);

  const requestBrowserLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return false;
    }

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          // Approximate Indian metro coordinate mapping for clean UI
          let detectedCity = 'Mumbai';
          let detectedState = 'Maharashtra';

          if (latitude >= 26.8 && latitude <= 27.5 && longitude >= 77.5 && longitude <= 78.5) {
            detectedCity = 'Agra';
            detectedState = 'Uttar Pradesh';
          } else if (latitude > 28) {
            detectedCity = 'New Delhi';
            detectedState = 'Delhi NCR';
          } else if (latitude < 14) {
            detectedCity = 'Bengaluru';
            detectedState = 'Karnataka';
          } else if (longitude > 85) {
            detectedCity = 'Kolkata';
            detectedState = 'West Bengal';
          } else if (latitude > 16 && latitude < 18) {
            detectedCity = 'Hyderabad';
            detectedState = 'Telangana';
          }

          try {
            const updated = await api.setLocation({
              latitude,
              longitude,
              city: detectedCity,
              state: detectedState,
              country: 'India',
              permissionGranted: true
            });
            setLocation(updated);
            setShowPrompt(false);
            resolve(true);
          } catch (e) {
            console.error(e);
            resolve(false);
          }
        },
        error => {
          console.warn('Geolocation denied or unavailable:', error.message);
          resolve(false);
        },
        { timeout: 10000 }
      );
    });
  };

  const setCityManually = async (city: string, state: string) => {
    try {
      const updated = await api.setLocation({
        city,
        state,
        country: 'India',
        permissionGranted: true
      });
      setLocation(updated);
      setShowPrompt(false);
    } catch (err) {
      console.error(err);
    }
  };

  const disableLocation = async () => {
    try {
      await api.deleteLocation();
      setLocation({
        id: 'loc-default',
        userId: 'usr-demo-1',
        city: 'All India',
        state: 'National',
        country: 'India',
        permissionGranted: false,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    sessionStorage.setItem('amazon_mobile_loc_dismissed', 'true');
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        showPrompt,
        setShowPrompt,
        requestBrowserLocation,
        setCityManually,
        disableLocation,
        dismissPrompt
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
