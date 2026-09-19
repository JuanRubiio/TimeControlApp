import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
import { geoVerification,policyInput } from '../src/clocking-policy/validation';

describe('S30 piloto de ubicación puntual',()=>{
  const migration=readFileSync('migrations/s030_202609142130_geo_punctual_pilot.sql','utf8');
  const accuracyMigration=readFileSync('migrations/s036_202609191325_geo_accuracy_band.sql','utf8');
  const eventMigration=readFileSync('migrations/s037_202609191340_geo_punctual_event_constraint.sql','utf8');
  const service=readFileSync('src/time-events/service.ts','utf8');
  it('acepta la precisión informada por el navegador sin ampliar la zona',()=>{
    expect(geoVerification.safeParse({latitude:40.4,longitude:-3.7,accuracy:100}).success).toBe(true);
    expect(geoVerification.safeParse({latitude:40.4,longitude:-3.7,accuracy:500}).success).toBe(true);
    expect(geoVerification.safeParse({latitude:40.4,longitude:-3.7,accuracy:5001}).success).toBe(false);
    expect(policyInput.safeParse({employmentId:'10000000-0000-4000-8000-000000000001',method:'geo_punctual',locationZoneId:null,reasonCode:'approved_mobility',effectiveFrom:'2026-09-14'}).success).toBe(false);
  });
  it('no crea una tabla para persistir coordenadas de fichaje',()=>{
    expect(migration).toContain('time_event_geo_verifications');
    expect(migration).not.toMatch(/time_event_geo_verifications[\s\S]*latitude/i);
    expect(service).toContain('distanceMeters(geo,geoPolicy)');
    expect(service).toContain("GEO_OUTSIDE_AUTHORIZED_ZONE");
    expect(service).toContain('>geoPolicy.radiusMeters)');
    expect(service).not.toContain('>geoPolicy.radiusMeters+geo.accuracy');
    expect(accuracyMigration).toContain("'over_100m'");
    expect(accuracyMigration).not.toMatch(/latitude|longitude/i);
    expect(eventMigration).toContain('DROP CONSTRAINT IF EXISTS time_events_check');
    expect(eventMigration).toContain("method IN ('web','geo_punctual')");
  });
});
