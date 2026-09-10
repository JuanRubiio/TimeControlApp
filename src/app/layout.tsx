import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control horario',
  description: 'Fundaciones seguras del MVP de control horario'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
