import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import './route-transitions.css';

export const metadata: Metadata = {
  title: 'Control horario',
  description: 'Fichaje web seguro y no invasivo',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
