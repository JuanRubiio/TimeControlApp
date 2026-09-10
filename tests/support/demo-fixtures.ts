/**
 * Datos exclusivamente sintéticos para pruebas y demostraciones locales.
 * Los UUID permiten reejecutar un perfil sin generar duplicados.
 */
export const DEMO_PASSWORD_ENV = 'DEMO_PASSWORD';

export type DemoProfile = 'office' | 'multisite';
export type DemoEmployee = { key:string; id:string; userId:string; email:string; displayName:string; role:'admin'|'manager'|'employee'; siteKey:string; schedule:'standard'|'split'|'overnight' };

export const DEMO_PROFILES = {
  office: {
    company: { id:'10000000-0000-4000-8000-000000000001', name:'Nébula Oficina Demo, S.L.' },
    sites: [{ key:'office', id:'11000000-0000-4000-8000-000000000001', name:'Sede Ficticia Norte', timeZone:'Europe/Madrid' }],
    calendar: { id:'12000000-0000-4000-8000-000000000001', name:'Calendario Oficina Demo 2026', timeZone:'Europe/Madrid', workingDays:[1,2,3,4,5], holidays:['2026-01-01','2026-12-25'] },
    shifts: [
      { key:'standard', id:'13000000-0000-4000-8000-000000000001', name:'Jornada estándar demo', segments:[{start:'09:00',end:'17:00'}] },
      { key:'split', id:'13000000-0000-4000-8000-000000000002', name:'Jornada partida demo', segments:[{start:'09:00',end:'14:00'},{start:'15:00',end:'18:00'}] },
      { key:'overnight', id:'13000000-0000-4000-8000-000000000003', name:'Turno nocturno demo', segments:[{start:'22:00',end:'06:00'}] }
    ]
  },
  multisite: {
    company: { id:'20000000-0000-4000-8000-000000000001', name:'Horizonte Multicentro Demo, S.L.' },
    sites: [
      { key:'madrid', id:'21000000-0000-4000-8000-000000000001', name:'Centro Demo Madrid', timeZone:'Europe/Madrid' },
      { key:'canarias', id:'21000000-0000-4000-8000-000000000002', name:'Centro Demo Canarias', timeZone:'Atlantic/Canary' },
      { key:'levante', id:'21000000-0000-4000-8000-000000000003', name:'Centro Demo Levante', timeZone:'Europe/Madrid' }
    ],
    calendar: { id:'22000000-0000-4000-8000-000000000001', name:'Calendario Multicentro Demo 2026', timeZone:'Europe/Madrid', workingDays:[1,2,3,4,5], holidays:['2026-01-01','2026-12-25'] },
    shifts: [
      { key:'standard', id:'23000000-0000-4000-8000-000000000001', name:'Jornada estándar demo', segments:[{start:'09:00',end:'17:00'}] },
      { key:'split', id:'23000000-0000-4000-8000-000000000002', name:'Jornada partida demo', segments:[{start:'09:00',end:'14:00'},{start:'15:00',end:'18:00'}] },
      { key:'overnight', id:'23000000-0000-4000-8000-000000000003', name:'Turno nocturno demo', segments:[{start:'22:00',end:'06:00'}] }
    ]
  }
} as const;

export const demoEmployees = (profile:DemoProfile): readonly DemoEmployee[] => {
  const prefix = profile === 'office' ? '1' : '2';
  const primarySite = profile === 'office' ? 'office' : 'madrid';
  return [
    {key:'admin', id:`${prefix}4000000-0000-4000-8000-000000000001`,userId:`${prefix}5000000-0000-4000-8000-000000000001`,email:`admin.${profile}@demo.test`,displayName:'Cuenta Demo Administración',role:'admin',siteKey:primarySite,schedule:'standard'},
    {key:'manager', id:`${prefix}4000000-0000-4000-8000-000000000002`,userId:`${prefix}5000000-0000-4000-8000-000000000002`,email:`manager.${profile}@demo.test`,displayName:'Cuenta Demo Responsable',role:'manager',siteKey:profile === 'multisite' ? 'canarias' : primarySite,schedule:'split'},
    {key:'night', id:`${prefix}4000000-0000-4000-8000-000000000003`,userId:`${prefix}5000000-0000-4000-8000-000000000003`,email:`night.${profile}@demo.test`,displayName:'Cuenta Demo Nocturna',role:'employee',siteKey:profile === 'multisite' ? 'levante' : primarySite,schedule:'overnight'}
  ];
};

export const QA_TEMPORAL_CASES = [
  { name:'medianoche Madrid', instant:'2026-01-10T23:30:00.000Z', timeZone:'Europe/Madrid', laborDate:'2026-01-11' },
  { name:'DST adelanto Madrid', instant:'2026-03-29T00:30:00.000Z', timeZone:'Europe/Madrid', laborDate:'2026-03-29' },
  { name:'DST retraso Madrid', instant:'2026-10-25T01:30:00.000Z', timeZone:'Europe/Madrid', laborDate:'2026-10-25' }
] as const;
