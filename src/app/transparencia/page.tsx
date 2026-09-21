import Link from 'next/link';

const sections = [
  {
    id: 'registro',
    number: '01',
    title: 'Registro de jornada',
    body: 'TimeControl registra las acciones que una persona realiza para iniciar, pausar o finalizar su jornada. La información se presenta para que pueda revisarse junto con las incidencias y correcciones que correspondan.',
    facts: ['La persona consulta su propia jornada.', 'Las correcciones se revisan por personas responsables.', 'La aplicación no mide productividad ni asigna puntuaciones.'],
  },
  {
    id: 'ubicacion',
    number: '02',
    title: 'Ubicación puntual',
    body: 'Cada organización puede decidir si configura una comprobación de ubicación al fichar. Cuando está disponible, se solicita únicamente en ese momento concreto; TimeControl no realiza seguimiento continuo ni crea recorridos.',
    facts: ['La ubicación no está activa por defecto para todas las organizaciones.', 'Su uso depende de la configuración de cada organización.', 'No se solicita desde esta página pública.'],
  },
  {
    id: 'limites',
    number: '03',
    title: 'Límites y accesibilidad',
    body: 'La aplicación organiza información de jornada y deja las decisiones en manos de las personas. Esta página se puede recorrer con teclado, incluye enlaces internos y mantiene el foco visible para facilitar la navegación.',
    facts: ['No hay analítica, formularios ni captación de datos en esta página.', 'No se toman decisiones disciplinarias automáticas.', 'El acceso al entorno requiere las credenciales de la organización.'],
  },
];

export default function TransparencyPage(){
  return <main className="transparency-shell">
    <nav className="landing-nav" aria-label="Principal"><Link className="landing-brand" href="/">TimeControl</Link><Link className="landing-login-link" href="/login">Acceder</Link></nav>
    <header className="transparency-hero" aria-labelledby="transparency-title">
      <p className="eyebrow">INFORMACIÓN DEL PRODUCTO</p>
      <h1 id="transparency-title">Cómo funciona TimeControl.</h1>
      <p>Una guía clara sobre el registro de jornada, la ubicación puntual que una organización puede configurar y los límites del producto.</p>
      <nav className="transparency-toc" aria-label="En esta página">
        {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>
    </header>
    <div className="transparency-sections">
      {sections.map((section) => <section className="transparency-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
        <p className="transparency-section__number" aria-hidden="true">{section.number}</p>
        <div><h2 id={`${section.id}-title`}>{section.title}</h2><p>{section.body}</p></div>
        <ul>{section.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
      </section>)}
    </div>
    <aside className="transparency-note" aria-label="Alcance de esta información"><strong>Información de producto, no de una organización concreta.</strong><span>Esta página describe el funcionamiento general de TimeControl. No muestra datos personales, de organización ni configura permisos.</span></aside>
    <footer className="landing-footer"><span>Revisión editorial: 21 de septiembre de 2026 · v1.0</span><Link href="/">Volver al inicio</Link></footer>
  </main>;
}
