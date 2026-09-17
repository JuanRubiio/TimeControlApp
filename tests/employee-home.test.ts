import { describe,expect,it } from 'vitest';
import { addDays,homeDay,weekStart } from '../src/employee-home/contracts';
import type { PublishedWorkday } from '../src/time-calculation/contracts';

const published=(date:string):PublishedWorkday=>({laborDate:date,effectiveTimeZone:'Europe/Madrid',evidence:{status:'no_evidence',laborDate:null},schedule:{ruleVersionId:'rule',effectiveFrom:'2026-01-01',effectiveTo:null,timeZone:'Europe/Madrid',expectedMinutes:480,calendar:{id:'calendar',name:'Calendario demo',timeZone:'Europe/Madrid',workingDays:[1,2,3,4,5],holidays:[]},shift:{id:'shift',name:'Diurno',segments:[{start:'09:00',end:'17:00'}]}}});

describe('inicio personal de empleado',()=>{
  it('calcula una semana ISO y conserva un calendario de fechas estable',()=>{
    expect(weekStart('2026-09-17')).toBe('2026-09-14');
    expect(addDays('2026-09-30',1)).toBe('2026-10-01');
  });
  it('muestra excepciones aprobadas antes de festivo, descanso y horario',()=>{
    const workday=published('2026-09-18');
    expect(homeDay('2026-09-18',workday,null,[{date:'2026-09-18',type:'local'}],[{fromDate:'2026-09-18',toDate:'2026-09-18',category:'vacation'}]).kind).toBe('vacation');
    expect(homeDay('2026-09-18',workday,null,[{date:'2026-09-18',type:'local'}],[]).label).toBe('Festivo local');
    expect(homeDay('2026-09-19',published('2026-09-19'),null,[],[]).kind).toBe('rest');
  });
  it('no inventa una comparación sin jornada publicada',()=>{
    expect(homeDay('2026-09-20',null,null,[],[])).toMatchObject({kind:'no_schedule',expectedMinutes:null,effectiveMinutes:null});
  });
});
