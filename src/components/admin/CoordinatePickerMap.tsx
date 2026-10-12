import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface CoordinatePickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  height?: string;
}

const pickerIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="40" height="51">
      <path d="M 18 2 C 8.6 2 1 9.6 1 19 C 1 29 18 44 18 44 C 18 44 35 29 35 19 C 35 9.6 27.4 2 18 2 Z" fill="#D8A64C" stroke="#082A4A" stroke-width="3"/>
      <circle cx="18" cy="18" r="6" fill="#082A4A"/>
    </svg>
  `,
  className: 'coordinate-picker-pin',
  iconSize: [40, 51],
  iconAnchor: [20, 51],
});

/** Re-centra el mapa cuando las coordenadas cambian desde fuera (inputs). */
const RecenterOnChange: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom() < 13 ? 15 : map.getZoom(), { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);
  return null;
};

const ClickHandler: React.FC<{ onChange: (lat: number, lng: number) => void }> = ({ onChange }) => {
  useMapEvents({
    click(e) {
      onChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
};

export const CoordinatePickerMap: React.FC<CoordinatePickerMapProps> = ({
  lat,
  lng,
  onChange,
  height = 'h-56',
}) => {
  return (
    <div className={`w-full ${height} rounded-2xl overflow-hidden border border-slate-300 relative z-0`}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnChange lat={lat} lng={lng} />
        <ClickHandler onChange={onChange} />
        <Marker
          position={[lat, lng]}
          icon={pickerIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target as L.Marker;
              const pos = marker.getLatLng();
              onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
            },
          }}
        />
      </MapContainer>
    </div>
  );
};

export default CoordinatePickerMap;
