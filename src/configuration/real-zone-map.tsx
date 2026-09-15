'use client';

import { useEffect, useRef } from 'react';
import type { Circle, Map as LeafletMap, Marker } from 'leaflet';

type Point = { latitude: number; longitude: number };

export function RealZoneMap({ latitude, longitude, radiusMeters, onPointChange }: Point & { radiusMeters: number; onPointChange: (point: Point) => void }) {
  const containerRef = useRef<HTMLDivElement>(null); const mapRef = useRef<LeafletMap | null>(null); const markerRef = useRef<Marker | null>(null); const circleRef = useRef<Circle | null>(null); const onPointChangeRef = useRef(onPointChange);
  useEffect(() => { onPointChangeRef.current = onPointChange; }, [onPointChange]);
  useEffect(() => {
    let disposed = false;
    void import('leaflet').then((L) => {
      if (disposed || !containerRef.current) return;
      const initialPoint: [number, number] = [latitude, longitude];
      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(initialPoint, 16);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' }).addTo(map);
      const icon = L.divIcon({ className: 'zone-map-pin', html: '<svg viewBox="0 0 32 42" width="32" height="42" aria-hidden="true" focusable="false"><path d="M16 1C8.84 1 3 6.84 3 14c0 9.75 13 27 13 27s13-17.25 13-27C29 6.84 23.16 1 16 1Z" fill="#165fc8" stroke="#fff" stroke-width="3"/><circle cx="16" cy="14" r="4.5" fill="#dcecff"/></svg>', iconSize: [32, 42], iconAnchor: [16, 42] });
      const marker = L.marker(initialPoint, { draggable: true, icon, title: 'Centro de la zona autorizada' }).addTo(map);
      const circle = L.circle(initialPoint, { radius: radiusMeters, color: '#1d68d5', weight: 3, fillColor: '#3e86e9', fillOpacity: 0.22 }).addTo(map);
      map.fitBounds(circle.getBounds(), { padding: [28, 28], maxZoom: 17, animate: false });
      const updatePoint = (point: { lat: number; lng: number }) => onPointChangeRef.current({ latitude: Number(point.lat.toFixed(6)), longitude: Number(point.lng.toFixed(6)) });
      marker.on('dragend', () => updatePoint(marker.getLatLng()));
      map.on('click', (event) => updatePoint(event.latlng));
      mapRef.current = map; markerRef.current = marker; circleRef.current = circle;
    });
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; markerRef.current = null; circleRef.current = null; };
  }, []);
  useEffect(() => {
    const point: [number, number] = [latitude, longitude];
    markerRef.current?.setLatLng(point); circleRef.current?.setLatLng(point).setRadius(radiusMeters);
    const map = mapRef.current;
    if (map && circleRef.current) map.fitBounds(circleRef.current.getBounds(), { padding: [28, 28], maxZoom: 17, animate: false });
  }, [latitude, longitude, radiusMeters]);
  return <figure className="zone-map" aria-labelledby="zone-map-title"><figcaption><strong id="zone-map-title">Mapa de la zona autorizada</strong><span>Arrastre el marcador o pulse el mapa para elegir el punto real de referencia.</span></figcaption><div ref={containerRef} className="zone-map-canvas" aria-label="Mapa interactivo de OpenStreetMap con centro y radio de la zona" /><p>OpenStreetMap recibe únicamente las teselas necesarias para mostrar este mapa. No se solicita la ubicación del administrador ni se comparte la de ninguna persona.</p></figure>;
}
