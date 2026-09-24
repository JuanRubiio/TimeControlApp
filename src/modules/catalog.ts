export type ModuleKey='shift_planning'|'exports'|'informative_hour_balance';
export type ModuleStatus='disabled'|'configured'|'active'|'paused';
export type ProductModule={key:ModuleKey;name:string;description:string;availability:string;locked:boolean};

export const PRODUCT_MODULES:readonly ProductModule[]=[
  {key:'shift_planning',name:'Planificación futura',description:'Plantillas y publicaciones futuras por centro.',availability:'Disponible al instalarlo.',locked:false},
  {key:'informative_hour_balance',name:'Balance informativo',description:'Consulta personal de jornadas cerradas y revisión mensual informativa.',availability:'Disponible al instalarlo.',locked:false},
  {key:'exports',name:'Exportaciones',description:'Solicitudes y descargas auditables de registros.',availability:'Instalable, pero bloqueado hasta el cierre verificable de S15.',locked:true}
];

export const installed=(status:ModuleStatus)=>status!=='disabled';
