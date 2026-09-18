import Link from 'next/link';

const principles = [
  { title: 'Registro claro', description: 'La persona registra la acción que corresponde y consulta una jornada comprensible, con sus pausas e incidencias visibles.' },
  { title: 'Criterio humano', description: 'Las correcciones, solicitudes y decisiones se revisan por las personas responsables. La aplicación no toma decisiones disciplinarias.' },
  { title: 'Acceso por rol', description: 'Cada persona ve sólo el espacio que necesita: jornada propia, equipo o administración del entorno.' },
];

const commitments = [
  'No realiza seguimiento continuo de ubicación.',
  'No mide productividad ni automatiza decisiones sobre personas.',
  'No ofrece registro público ni recopila datos de contacto desde esta página.',
];

export default function Home(){
  return <main className="landing-shell">
    <nav className="landing-nav" aria-label="Principal"><Link className="landing-brand" href="/">TimeControl</Link><Link className="landing-login-link" href="/login">Acceder</Link></nav>
    <section className="landing-hero" aria-labelledby="landing-title"><p className="eyebrow">Control horario</p><h1 id="landing-title">Una jornada clara, trazable y centrada en las personas.</h1><p className="landing-lead">TimeControl ayuda a equipos y responsables a registrar la jornada con información comprensible, decisiones revisables y límites explícitos.</p><Link className="landing-cta" href="/login">Acceder a TimeControl</Link></section>
    <section className="landing-section" aria-labelledby="how-title"><div className="landing-section-heading"><p className="eyebrow">Cómo se trabaja</p><h2 id="how-title">Lo esencial, sin añadir vigilancia.</h2></div><div className="landing-principles">{principles.map((principle, index) => <article key={principle.title}><span aria-hidden="true">0{index + 1}</span><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></section>
    <section className="landing-commitment" aria-labelledby="limits-title"><div><p className="eyebrow">Límites claros</p><h2 id="limits-title">La tecnología acompaña; no sustituye el criterio.</h2><p>Cuando una organización configura una verificación de ubicación, se solicita sólo en el momento concreto de fichar. La configuración y las decisiones continúan siendo responsabilidad de la empresa.</p></div><ul>{commitments.map((commitment) => <li key={commitment}>{commitment}</li>)}</ul></section>
    <section className="landing-final" aria-labelledby="access-title"><div><p className="eyebrow">Acceso al entorno</p><h2 id="access-title">Tu organización te da acceso a tu espacio de trabajo.</h2><p>Usa las credenciales facilitadas por tu organización para consultar y registrar la información que te corresponde.</p></div><Link className="landing-cta" href="/login">Iniciar sesión</Link></section>
    <footer className="landing-footer">TimeControl · Control horario</footer>
  </main>;
}
