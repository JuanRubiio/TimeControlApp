export type OfficialHolidaySource={id:string;name:string;publisher:string;coverage:'national_regional';territory:string;formats:readonly string[];url:string;reviewRequired:boolean;adapter:'boe'};

// Registro cerrado: la Administración elige una fuente conocida, nunca una URL
// arbitraria. Cada adaptador valida su propio formato antes de proponer cambios.
export const OFFICIAL_HOLIDAY_SOURCES:readonly OfficialHolidaySource[]=[
  {id:'boe-labour-calendar-2026',name:'Calendario laboral BOE 2026',publisher:'Ministerio de Trabajo y Economía Social · BOE',coverage:'national_regional',territory:'España',formats:['HTML','PDF','XML'],url:'https://www.boe.es/buscar/doc.php?id=BOE-A-2025-21667',reviewRequired:false,adapter:'boe'}
];
