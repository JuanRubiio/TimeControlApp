import { describe, expect, it } from 'vitest';
import { OFFICIAL_HOLIDAY_SOURCES } from '@/holiday-sources/catalog';
import { parseCastellon, parseCatalunya } from '@/holiday-sources/service';

describe('official holiday source catalogue',()=>{
  it('contains a common official source and structured local sources',()=>{
    expect(OFFICIAL_HOLIDAY_SOURCES.find(source=>source.id==='boe-labour-calendar')?.coverage).toBe('national_regional');
    expect(OFFICIAL_HOLIDAY_SOURCES.filter(source=>source.coverage==='local').map(source=>source.id)).toEqual(expect.arrayContaining(['euskadi-labour-calendar','catalunya-local-holidays','castilla-leon-local-holidays','castellon-local-holidays']));
  });
  it('allows only known https official sources',()=>{
    expect(OFFICIAL_HOLIDAY_SOURCES).toHaveLength(new Set(OFFICIAL_HOLIDAY_SOURCES.map(source=>source.id)).size);
    expect(OFFICIAL_HOLIDAY_SOURCES.every(source=>new URL(source.url).protocol==='https:')).toBe(true);
  });
  it('normalizes the published local records without guessing dates',()=>{
    expect(parseCatalunya([{any_calendari:'2026',data:'2026-05-25T00:00:00.000',ajuntament_o_nucli_municipal:'Abrera',festiu:'Festiu local'}],'abrera',2026)).toEqual([{date:'2026-05-25',label:'Festiu local',type:'local',locality:'Abrera'}]);
    expect(parseCastellon([{localidad:'Aín',fecha:'16 de agosto',festividad:'El Cristo'}],'Ain',2026)).toEqual([{date:'2026-08-16',label:'El Cristo',type:'local',locality:'Aín'}]);
  });
});
