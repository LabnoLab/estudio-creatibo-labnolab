'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TrendAnalysis } from '@/types/analysis';
import { Loader2 } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface TrendMapProps {
  analysis: TrendAnalysis;
}

interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  type: 'epicentro' | 'adopcion' | 'resistencia';
  intensity: number;
  description: string;
}

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'España': { lat: 40.4637, lng: -3.7492 },
  'Estados Unidos': { lat: 39.8283, lng: -98.5795 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Reino Unido': { lat: 55.3781, lng: -3.4360 },
  'Francia': { lat: 46.6034, lng: 1.8883 },
  'Alemania': { lat: 51.1657, lng: 10.4515 },
  'Japón': { lat: 36.2048, lng: 138.2529 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Brasil': { lat: -14.2350, lng: -51.9253 },
  'Europa': { lat: 54.5260, lng: 15.2551 },
  'Asia': { lat: 29.8406, lng: 89.2966 },
  'América Latina': { lat: -8.7832, lng: -55.4915 },
  'Norteamérica': { lat: 45.0, lng: -100.0 },
  'Global': { lat: 30.0, lng: 0.0 }
};

const TrendMap: React.FC<TrendMapProps> = ({ analysis }) => {
  const [isClient, setIsClient] = useState(false);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🗺️ TrendMap: iniciando componente');
    
    // Delay para asegurar que el cliente está listo
    const initializeMap = () => {
      setIsClient(true);
      
      const processGeographicData = () => {
        console.log('🗺️ TrendMap: procesando datos geográficos', analysis.analisis.analisis_geografico);
      const locations: MapLocation[] = [];
      
      if (analysis.analisis.analisis_geografico.epicentro) {
        const epicentro = analysis.analisis.analisis_geografico.epicentro;
        const coords = LOCATION_COORDS[epicentro] || LOCATION_COORDS['Global'];
        locations.push({
          name: epicentro,
          lat: coords.lat,
          lng: coords.lng,
          type: 'epicentro',
          intensity: 90,
          description: `Epicentro: ${analysis.analisis.resumen_ejecutivo.concepto_principal}`
        });
      }

      analysis.analisis.analisis_geografico.zonas_adopcion.forEach((zona, index) => {
        const coords = LOCATION_COORDS[zona];
        if (coords) {
          locations.push({
            name: zona,
            lat: coords.lat,
            lng: coords.lng,
            type: 'adopcion',
            intensity: 70 - (index * 10),
            description: `Adopción activa - Impacto: ${analysis.kpis.probabilidad_impacto}%`
          });
        }
      });

      analysis.analisis.analisis_geografico.resistencias.forEach((zona) => {
        const coords = LOCATION_COORDS[zona];
        if (coords) {
          locations.push({
            name: zona,
            lat: coords.lat,
            lng: coords.lng,
            type: 'resistencia',
            intensity: 30,
            description: `Resistencia - Credibilidad: ${analysis.kpis.indice_credibilidad}/100`
          });
        }
      });

      if (locations.length === 0) {
        analysis.conexiones.tags_geograficos.forEach((tag) => {
          const coords = LOCATION_COORDS[tag];
          if (coords) {
            locations.push({
              name: tag,
              lat: coords.lat,
              lng: coords.lng,
              type: 'adopcion',
              intensity: 60,
              description: `Región relevante - ${analysis.kpis.potencial_disruptivo}`
            });
          }
        });
      }

        console.log('🗺️ TrendMap: ubicaciones procesadas', locations);
        setMapLocations(locations);
        setIsLoading(false);
      };

      processGeographicData();
    };

    // Pequeño delay para asegurar hidratación completa
    const timeoutId = setTimeout(initializeMap, 100);
    
    return () => clearTimeout(timeoutId);
  }, [analysis]);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'epicentro': return '#00ff88';
      case 'adopcion': return '#00d4ff';
      case 'resistencia': return '#ef4444';
      default: return '#64748b';
    }
  };

  if (!isClient || isLoading) {
    console.log('🗺️ TrendMap: componente no listo', { isClient, isLoading });
    return (
      <div className="h-[400px] bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/30">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-slate-500">Cargando mapa geográfico...</p>
          <p className="text-xs text-slate-600 mt-1">Client: {isClient ? '✓' : '✗'} | Loading: {isLoading ? '✓' : '✗'}</p>
        </div>
      </div>
    );
  }

  console.log('🗺️ TrendMap: renderizando mapa con', mapLocations.length, 'ubicaciones');

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-[1000] bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff88]"></div>
            <span className="text-xs text-slate-300">Epicentro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00d4ff]"></div>
            <span className="text-xs text-slate-300">Adopción</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-xs text-slate-300">Resistencia</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] rounded-lg overflow-hidden border border-slate-700/30 relative">
        {/* Fallback temporal para debug */}
        <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center z-10 opacity-90">
          <div className="text-center p-4 bg-slate-900/80 rounded-lg border border-slate-600">
            <div className="text-2xl mb-2">🗺️</div>
            <p className="text-sm text-slate-300 font-medium">MAPA GEOGRÁFICO AQUÍ</p>
            <p className="text-xs text-slate-500 mt-1">{mapLocations.length} ubicaciones detectadas</p>
            <div className="mt-3 text-xs text-slate-400">
              <p>• Client ready: {isClient ? '✅' : '❌'}</p>
              <p>• Loading: {isLoading ? '⏳' : '✅'}</p>
              <p>• Leaflet CSS: {typeof window !== 'undefined' ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>
        
        <MapContainer
          center={[40.4637, -3.7492]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="filter brightness-75 contrast-125"
          />
          
          {mapLocations.map((location, index) => (
            <Circle
              key={`${location.name}-${index}`}
              center={[location.lat, location.lng]}
              radius={location.intensity * 30000}
              pathOptions={{
                color: getMarkerColor(location.type),
                fillColor: getMarkerColor(location.type),
                fillOpacity: 0.3,
                weight: 2
              }}
            />
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 text-xs text-slate-400 flex items-center justify-between">
        <span>{mapLocations.length} ubicaciones identificadas</span>
        <span>Propagación: {analysis.kpis.velocidad_propagacion}</span>
      </div>

      <div className="mt-4 space-y-2">
        {mapLocations.map((location, index) => (
          <div key={`info-${location.name}-${index}`} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getMarkerColor(location.type) }}
            ></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{location.name}</span>
                <span className="text-xs text-slate-400">{location.intensity}%</span>
              </div>
              <p className="text-xs text-slate-400">{location.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendMap; 