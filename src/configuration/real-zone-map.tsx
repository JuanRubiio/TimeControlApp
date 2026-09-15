'use client';

import { useEffect, useRef } from 'react';
import type { Circle, CircleMarker, Map as LeafletMap } from 'leaflet';

type Point = { latitude: number; longitude: number };

export function RealZoneMap({ latitude, longitude, radiusMeters, onPointChange }: Point & { radiusMeters: number; onPointChange: (point: Point) => void }) {
  const containerRef = useRef<HTMLDivElement>(null); const mapRef = useRef<LeafletMap | null>(null); const centerRef = useRef<CircleMarker | null>(null); const circleRef = useRef<Circle | null>(null); const onPointChangeRef = useRef(onPointChange);
  useEffect(() => { onPointChangeRef.current = onPointChange; }, [onPointChange]);
  useEffect(() => {
    let disposed = false;
    void import('leaflet').then((L) => {
      if (disposed || !containerRef.current) return;
      const initialPoint: [number, number] = [latitude, longitude];
      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(initialPoint, 16);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' }).addTo(map);
      const circle = L.circle(initialPoint, { radius: radiusMeters, color: '#1d68d5', weight: 3, fillColor: '#3e86e9', fillOpacity: 0.22 }).addTo(map);
      const center = L.circleMarker(initialPoint, { radius: 7, color: '#ffffff', weight: 3, fillColor: '#165fc8', fillOpacity: 1, interactive: false }).addTo(map);
      map.fitBounds(circle.getBounds(), { padding: [28, 28], maxZoom: 17, animate: false });
      const updatePoint = (point: { lat: number; lng: number }) => onPointChangeRef.current({ latitude: Number(point.lat.toFixed(6)), longitude: Number(point.lng.toFixed(6)) });
      map.on('click', (event) => updatePoint(event.latlng));
      mapRef.current = map; centerRef.current = center; circleRef.current = circle;
    });
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; centerRef.current = null; circleRef.current = null; };
  }, []);
  useEffect(() => {
    const point: [number, number] = [latitude, longitude];
    centerRef.current?.setLatLng(point); circleRef.current?.setLatLng(point).setRadius(radiusMeters);
    const map = mapRef.current;
    if (map && circleRef.current) map.fitBounds(circleRef.current.getBounds(), { padding: [28, 28], maxZoom: 17, animate: false });
  }, [latitude, longitude, radiusMeters]);
  return <figure className="zone-map" aria-labelledby="zone-map-title"><figcaption><strong id="zone-map-title">Mapa de la zona autorizada</strong><span>Pulse el mapa para elegir el punto real de referencia.</span></figcaption><div ref={containerRef} className="zone-map-canvas" aria-label="Mapa interactivo de OpenStreetMap con centro y radio de la zona" /><p>OpenStreetMap recibe únicamente las teselas necesarias para mostrar este mapa. No se solicita la ubicación del administrador ni se comparte la de ninguna persona.</p></figure>;
}
