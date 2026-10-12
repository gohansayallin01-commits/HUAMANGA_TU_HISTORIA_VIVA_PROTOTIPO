import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useAttractions } from '../context/AttractionsContext';

export const MapPage: React.FC = () => {
  const { publishedAttractions } = useAttractions();
  const [searchParams] = useSearchParams();
  const routeSlug = searchParams.get('ruta') || undefined;
  const selectedId = searchParams.get('id') || undefined;

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] flex flex-col animate-fade-in">
      <InteractiveMap
        attractions={publishedAttractions}
        initialSelectedId={selectedId}
        initialRouteSlug={routeSlug}
      />
    </div>
  );
};
