import { useState, useCallback } from 'react';

export interface LocationState {
  lat: number;
  lng: number;
  isCustom: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied';
  error: string | null;
  loading: boolean;
}

export const AYACUCHO_DEFAULT = {
  lat: -13.1631,
  lng: -74.2236,
};

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: AYACUCHO_DEFAULT.lat,
    lng: AYACUCHO_DEFAULT.lng,
    isCustom: false,
    permissionStatus: 'prompt',
    error: null,
    loading: false,
  });

  const requestLocation = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    if (!('geolocation' in navigator)) {
      setLocation(prev => ({
        ...prev,
        permissionStatus: 'denied',
        error: 'Geolocalización no soportada en este navegador.',
        loading: false,
      }));
      return Promise.resolve(null);
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation({
            ...coords,
            isCustom: true,
            permissionStatus: 'granted',
            error: null,
            loading: false,
          });
          resolve(coords);
        },
        (error) => {
          console.warn('Geolocation permission issue:', error.message);
          setLocation(prev => ({
            ...prev,
            lat: AYACUCHO_DEFAULT.lat,
            lng: AYACUCHO_DEFAULT.lng,
            isCustom: false,
            permissionStatus: 'denied',
            error: 'Permiso denegado. Se utiliza el centro de Huamanga.',
            loading: false,
          }));
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number) => {
    setLocation(prev => ({
      ...prev,
      lat,
      lng,
      isCustom: true,
      permissionStatus: prev.permissionStatus === 'denied' ? 'denied' : prev.permissionStatus,
      error: null,
      loading: false,
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setLocation({
      lat: AYACUCHO_DEFAULT.lat,
      lng: AYACUCHO_DEFAULT.lng,
      isCustom: false,
      permissionStatus: 'prompt',
      error: null,
      loading: false,
    });
  }, []);

  return { location, requestLocation, resetToDefault, setManualLocation };
}
