import { describe, expect, it } from 'vitest';
import { OFFICIAL_HOLIDAY_SOURCES } from '@/holiday-sources/catalog';
import { parseBoeCalendar } from '@/holiday-sources/service';

describe('official holiday source catalogue',()=>{
  it('contains only the common BOE source',()=>{
    expect(OFFICIAL_HOLIDAY_SOURCES.map(source=>source.id)).toEqual(['boe-labour-calendar-2026']);
    expect(OFFICIAL_HOLIDAY_SOURCES[0].coverage).toBe('national_regional');
  });
  it('allows only known https official sources',()=>{
    expect(OFFICIAL_HOLIDAY_SOURCES).toHaveLength(new Set(OFFICIAL_HOLIDAY_SOURCES.map(source=>source.id)).size);
    expect(OFFICIAL_HOLIDAY_SOURCES.every(source=>new URL(source.url).protocol==='https:')).toBe(true);
  });
  it('reads national and autonomous scope from the BOE table markers',()=>{
    const table='<tr><td id="header0601">6 Epifanía del Señor.</td><td headers="headerEnero header0601 headerMadrid"><abbr title="Fiesta Nacional no sustituible">*</abbr></td><td headers="headerEnero header0601 headerCataluna"><abbr title="Fiesta de Comunidad Autónoma">***</abbr></td></tr>';
    expect(parseBoeCalendar(table,'Madrid',2026)).toEqual([{date:'2026-01-06',label:'Epifanía del Señor.',type:'national'}]);
    expect(parseBoeCalendar(table,'Cataluña',2026)).toEqual([{date:'2026-01-06',label:'Epifanía del Señor.',type:'regional'}]);
  });
});
