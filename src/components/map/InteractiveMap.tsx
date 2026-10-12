import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Attraction } from '../../types';
import { useGeolocation, AYACUCHO_DEFAULT } from '../../hooks/useGeolocation';
import { useI18n } from '../../i18n/i18nContext';
import { formatDistance, calculateDistanceKm } from '../../utils/helpers';
import { StoredAttractionImage } from '../common/StoredAttractionImage';
import {
  Crosshair,
  RotateCcw,
  Footprints,
  Car,
  Info,
  Star,
  ExternalLink,
  Navigation,
  X,
  AlertTriangle,
  RefreshCw,
  MapPin,
  LocateFixed,
  CheckCircle2,
} from 'lucide-react';

interface InteractiveMapProps {
  attractions: Attraction[];
  initialSelectedId?: string;
  initialRouteSlug?: string;
}

type LatLngTuple = [number, number];

// Controla el encuadre del mapa: encuadra la ruta o centra en un punto.
const MapViewController: React.FC<{
  center: LatLngTuple;
  zoom: number;
  bounds: [LatLngTuple, LatLngTuple] | null;
  fitKey: number;
}> = ({ center, zoom, bounds, fitKey }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
    } else {
      map.setView(center, zoom, { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, center[0], center[1], zoom, map]);
  return null;
};

function createCategoryMarkerIcon(category: string, isSelected = false) {
  let color = '#082A4A';
  let badgeColor = '#D8A64C';

  if (category === 'iglesia') { color = '#0D3B66'; badgeColor = '#F2D493'; }
  else if (category === 'museo') { color = '#7E22CE'; badgeColor = '#E9D5FF'; }
  else if (category === 'naturaleza') { color = '#15803D'; badgeColor = '#BBF7D0'; }
  else if (category === 'gastronomia') { color = '#C2410C'; badgeColor = '#FFEDD5'; }
  else if (category === 'artesania') { color = '#B45309'; badgeColor = '#FEF08A'; }
  else if (category === 'hospedaje') { color = '#0F766E'; badgeColor = '#CCFBF1'; }
  else if (category === 'tour') { color = '#B45309'; badgeColor = '#F2D493'; }

  const size = isSelected ? 44 : 36;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="${size}" height="${size * 1.25}">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M 18 2 C 8.6 2 1 9.6 1 19 C 1 29 18 44 18 44 C 18 44 35 29 35 19 C 35 9.6 27.4 2 18 2 Z" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="8" fill="${badgeColor}"/>
      <circle cx="18" cy="18" r="4" fill="#082A4A"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-pin',
    iconSize: [size, size * 1.25],
    iconAnchor: [size / 2, size * 1.25],
    popupAnchor: [0, -size * 1.1],
  });
}

function createUserMarkerIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="14" fill="#2563EB" fill-opacity="0.25"/>
      <circle cx="16" cy="16" r="8" fill="#2563EB" stroke="#FFFFFF" stroke-width="2.5"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'user-location-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function createDestinationMarkerIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="46" height="58">
      <path d="M 18 2 C 8.6 2 1 9.6 1 19 C 1 29 18 44 18 44 C 18 44 35 29 35 19 C 35 9.6 27.4 2 18 2 Z" fill="#D8A64C" stroke="#082A4A" stroke-width="3"/>
      <path d="M 18 9 L 21 16 L 27 16 L 22 21 L 24 28 L 18 24 L 12 28 L 14 21 L 9 16 L 15 16 Z" fill="#082A4A"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'destination-leaflet-pin',
    iconSize: [46, 58],
    iconAnchor: [23, 58],
    popupAnchor: [0, -54],
  });
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  attractions,
  initialSelectedId,
  initialRouteSlug,
}) => {
  const { language, t } = useI18n();
  const navigate = useNavigate();
  const { location, requestLocation, resetToDefault, setManualLocation } = useGeolocation();

  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([AYACUCHO_DEFAULT.lat, AYACUCHO_DEFAULT.lng]);
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [routeDestination, setRouteDestination] = useState<Attraction | null>(null);
  const [routeOrigin, setRouteOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [originKind, setOriginKind] = useState<'gps' | 'demo' | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [fitKey, setFitKey] = useState(0);
  const routeInitRef = useRef<string | null>(null);

  const destCoords: LatLngTuple | null = routeDestination
    ? [routeDestination.coordinates.lat, routeDestination.coordinates.lng]
    : null;

  const distanceKm =
    routeOrigin && destCoords
      ? calculateDistanceKm(routeOrigin.lat, routeOrigin.lng, destCoords[0], destCoords[1])
      : 0;

  const atDestination = !!routeOrigin && distanceKm < 0.05;
  const walkingMinutes = Math.max(1, Math.round(distanceKm * 12.5));
  const drivingMinutes = Math.max(1, Math.round(distanceKm * 2.4));

  const routeBounds: [LatLngTuple, LatLngTuple] | null =
    routeOrigin && destCoords
      ? [[routeOrigin.lat, routeOrigin.lng], destCoords]
      : null;

  const polylinePositions: LatLngTuple[] | null =
    routeOrigin && destCoords && distanceKm >= 0.02
      ? [[routeOrigin.lat, routeOrigin.lng], destCoords]
      : null;

  const gmapsUrl = destCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${destCoords[0]},${destCoords[1]}&travelmode=walking${
        routeOrigin ? `&origin=${routeOrigin.lat},${routeOrigin.lng}` : ''
      }`
    : '#';

  const wazeUrl = destCoords
    ? `https://waze.com/ul?ll=${destCoords[0]},${destCoords[1]}&navigate=yes`
    : '#';

  const startRoute = async (attr: Attraction) => {
    setRouteDestination(attr);
    setSelectedAttraction(attr);
    setRouteOrigin(null);
    setOriginKind(null);
    setGeoStatus('loading');
    const coords = await requestLocation();
    if (coords) {
      setRouteOrigin(coords);
      setOriginKind('gps');
      setGeoStatus('granted');
      setFitKey((k) => k + 1);
    } else {
      setGeoStatus('denied');
    }
  };

  const useDemoOrigin = () => {
    setManualLocation(AYACUCHO_DEFAULT.lat, AYACUCHO_DEFAULT.lng);
    setRouteOrigin({ lat: AYACUCHO_DEFAULT.lat, lng: AYACUCHO_DEFAULT.lng });
    setOriginKind('demo');
    setGeoStatus('granted');
    setFitKey((k) => k + 1);
  };

  const closeRoute = () => {
    setRouteDestination(null);
    setRouteOrigin(null);
    setOriginKind(null);
    setGeoStatus('idle');
  };

  const handleLocateMe = async () => {
    const coords = await requestLocation();
    if (coords) {
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(15);
      if (routeDestination) {
        setRouteOrigin(coords);
        setOriginKind('gps');
        setGeoStatus('granted');
        setFitKey((k) => k + 1);
      }
    }
  };

  useEffect(() => {
    if (initialSelectedId) {
      const found = attractions.find((a) => a.id === initialSelectedId);
      if (found) {
        setSelectedAttraction(found);
        setMapCenter([found.coordinates.lat, found.coordinates.lng]);
        setMapZoom(16);
      }
    }
  }, [initialSelectedId, attractions]);

  useEffect(() => {
    if (initialRouteSlug && routeInitRef.current !== initialRouteSlug) {
      const found = attractions.find((a) => a.slug === initialRouteSlug);
      if (found) {
        routeInitRef.current = initialRouteSlug;
        void startRoute(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRouteSlug, attractions]);

  const filteredAttractions =
    activeCategory === 'todos'
      ? attractions
      : attractions.filter((a) => a.category === activeCategory);

  const handleSelectCard = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setMapCenter([attraction.coordinates.lat, attraction.coordinates.lng]);
    setMapZoom(16);
  };

  const originLabel =
    originKind === 'demo' ? 'Punto de partida de demostración (Plaza Mayor)' : 'Tu ubicación actual';

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] flex flex-col bg-slate-100 overflow-hidden">
      {/* Filtros de Categoría superiores flotantes */}
      <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
        {['todos', 'historico', 'iglesia', 'museo', 'artesania', 'gastronomia', 'naturaleza'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all ${
              activeCategory === cat
                ? 'bg-ayacucho-night text-ayacucho-lightgold border border-ayacucho-gold/40 scale-105'
                : 'bg-white/95 backdrop-blur-sm text-slate-700 hover:bg-white border border-slate-200'
            }`}
          >
            {cat === 'todos' ? 'Todos los lugares' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Controles flotantes laterales (Mi ubicación, Centrar) */}
      <div className="absolute right-3 top-16 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleLocateMe}
          className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-ayacucho-night hover:bg-slate-50 transition border border-slate-200"
          title="Usar mi ubicación"
          aria-label="Usar mi ubicación"
        >
          <Crosshair className={`w-5 h-5 ${location.isCustom ? 'text-blue-600' : 'text-slate-600'}`} />
        </button>

        <button
          onClick={() => {
            resetToDefault();
            setMapCenter([AYACUCHO_DEFAULT.lat, AYACUCHO_DEFAULT.lng]);
            setMapZoom(14);
            setSelectedAttraction(null);
            closeRoute();
          }}
          className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-ayacucho-night hover:bg-slate-50 transition border border-slate-200"
          title="Centrar en Huamanga"
          aria-label="Centrar en Huamanga"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Panel de ruta / "Cómo llegar" */}
      {routeDestination && (
        <div className="absolute top-16 left-3 right-16 z-20 bg-ayacucho-night/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-modal border border-ayacucho-gold/30 animate-slide-up pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-ayacucho-lightgold text-xs font-semibold">
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Ruta demostrativa a: {language === 'en' ? routeDestination.nameEn : routeDestination.name}
                </span>
              </div>

              {geoStatus === 'loading' && (
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-200">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-ayacucho-gold" />
                  <span>Obteniendo tu ubicación aproximada…</span>
                </div>
              )}

              {geoStatus === 'denied' && (
                <div className="mt-2">
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>
                      No pudimos acceder a tu ubicación. Puedes reintentar o usar un punto de
                      partida de demostración.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      onClick={() => void startRoute(routeDestination)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-ayacucho-gold text-ayacucho-night text-[11px] font-bold hover:bg-ayacucho-lightgold transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reintentar
                    </button>
                    <button
                      onClick={useDemoOrigin}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 text-ayacucho-lightgold text-[11px] font-semibold hover:bg-white/20 transition border border-ayacucho-gold/40"
                    >
                      <LocateFixed className="w-3 h-3" />
                      Usar origen de demostración
                    </button>
                  </div>
                </div>
              )}

              {geoStatus === 'granted' && routeOrigin && (
                <>
                  <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-1">
                    <MapPin className="w-3 h-3 text-ayacucho-gold" />
                    <span>{originLabel}</span>
                  </div>

                  {atDestination ? (
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ya te encuentras en este lugar</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                      <span className="font-bold text-white">{formatDistance(distanceKm)}</span>
                      <span className="text-slate-300">(distancia en línea recta)</span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <Footprints className="w-3.5 h-3.5 text-ayacucho-gold" />~{walkingMinutes} min a pie
                      </span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <Car className="w-3.5 h-3.5 text-emerald-400" />~{drivingMinutes} min en auto
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <a
                      href={gmapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/15"
                    >
                      <ExternalLink className="w-3 h-3 text-ayacucho-gold" />
                      Abrir en Google Maps
                    </a>
                    <a
                      href={wazeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/15"
                    >
                      <Navigation className="w-3 h-3 text-ayacucho-gold" />
                      Abrir en Waze
                    </a>
                  </div>
                </>
              )}

              <p className="text-[10px] text-ayacucho-lightgold/80 mt-2 border-t border-white/10 pt-1">
                * {t('map.routeReferentialNotice')}
              </p>
            </div>

            <button
              onClick={closeRoute}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white shrink-0"
              aria-label="Cerrar ruta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Contenedor del Mapa Leaflet */}
      <div className="flex-1 w-full h-full relative z-10">
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewController center={mapCenter} zoom={mapZoom} bounds={routeBounds} fitKey={fitKey} />

          {/* Marcador de usuario / origen */}
          {routeOrigin && (
            <Marker position={[routeOrigin.lat, routeOrigin.lng]} icon={createUserMarkerIcon()}>
              <Popup>
                <div className="p-2 text-xs font-semibold text-blue-700">📍 {originLabel}</div>
              </Popup>
            </Marker>
          )}

          {/* Línea de ruta demostrativa (línea recta referencial) */}
          {polylinePositions && (
            <Polyline positions={polylinePositions} color="#D8A64C" weight={5} dashArray="8, 8" opacity={0.85} />
          )}

          {/* Marcadores de Atractivos */}
          {filteredAttractions.map((attr) => {
            const isSelected = selectedAttraction?.id === attr.id;
            const isDestination = routeDestination?.id === attr.id;
            const name = language === 'en' ? attr.nameEn : attr.name;
            const distFromUser = calculateDistanceKm(
              location.lat,
              location.lng,
              attr.coordinates.lat,
              attr.coordinates.lng
            );

            return (
              <Marker
                key={attr.id}
                position={[attr.coordinates.lat, attr.coordinates.lng]}
                icon={
                  isDestination
                    ? createDestinationMarkerIcon()
                    : createCategoryMarkerIcon(attr.category, isSelected)
                }
                eventHandlers={{
                  click: () => setSelectedAttraction(attr),
                }}
              >
                <Popup>
                  <div className="w-56 overflow-hidden text-slate-800">
                    <div className="h-24 w-full relative">
                      <StoredAttractionImage src={attr.images[0]} alt={name} category={attr.category} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-ayacucho-night/90 text-ayacucho-lightgold text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {attr.category.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-2.5">
                      <h4 className="font-bold text-xs text-ayacucho-night line-clamp-1">{name}</h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {attr.rating.toFixed(1)}
                        </span>
                        <span>{formatDistance(distFromUser)}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                        <button
                          onClick={() => navigate(`/atractivo/${attr.slug}`)}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-ayacucho-night text-white text-[11px] font-semibold rounded-lg hover:bg-ayacucho-deep transition"
                        >
                          <Info className="w-3 h-3 text-ayacucho-gold" />
                          <span>Ver</span>
                        </button>

                        <button
                          onClick={() => void startRoute(attr)}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-ayacucho-gold text-ayacucho-night text-[11px] font-bold rounded-lg hover:bg-ayacucho-lightgold transition"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Cómo llegar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Carrusel horizontal inferior deslizable con tarjetas de lugares */}
      <div className="absolute bottom-2 left-0 right-0 z-20 px-3 pointer-events-auto">
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {filteredAttractions.map((attr) => {
            const isSelected = selectedAttraction?.id === attr.id;
            const name = language === 'en' ? attr.nameEn : attr.name;
            const dist = calculateDistanceKm(
              location.lat,
              location.lng,
              attr.coordinates.lat,
              attr.coordinates.lng
            );

            return (
              <div
                key={attr.id}
                onClick={() => handleSelectCard(attr)}
                className={`w-64 shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-elevated border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-ayacucho-gold ring-2 ring-ayacucho-gold/30 -translate-y-1'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex gap-2.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <StoredAttractionImage src={attr.images[0]} alt={name} category={attr.category} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase text-ayacucho-deep/80">
                      {attr.category}
                    </span>
                    <h5 className="font-bold text-xs text-ayacucho-night truncate">{name}</h5>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {attr.rating.toFixed(1)}
                      </span>
                      <span>{formatDistance(dist)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/atractivo/${attr.slug}`);
                    }}
                    className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold text-center flex items-center justify-center gap-1 transition"
                  >
                    <span>Detalle</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void startRoute(attr);
                    }}
                    className="flex-1 py-1 rounded-lg bg-ayacucho-night text-ayacucho-lightgold text-[10px] font-bold text-center flex items-center justify-center gap-1 hover:bg-ayacucho-deep transition"
                  >
                    <Navigation className="w-2.5 h-2.5 text-ayacucho-gold" />
                    <span>Cómo llegar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
