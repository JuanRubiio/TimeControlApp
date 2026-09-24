import { describe,expect,it } from 'vitest';
import { managerAttentionItems,managerHomeItems } from '../src/manager/home';

describe('inicio operativo del responsable',()=>{
  it('prioriza decisiones y excepciones futuras sin propagar comentarios personales',()=>{
    const home=managerHomeItems([{id:'correction',employeeId:'employee',laborDate:'2026-09-20',status:'pending',reason:'No debe aparecer',requestedAt:'2026-09-18T10:00:00.000Z',proposedEffect:{eventType:'clock_in',occurredAt:'2026-09-20T09:00:00.000Z'},decision:null}] as any,[{id:'leave',employeeId:'employee',siteId:'site',fromDate:'2026-09-22',toDate:'2026-09-22',category:'vacation',comment:'No debe aparecer',status:'approved',requestedAt:'2026-09-18T10:00:00.000Z',decision:null,cancelledAt:null}] as any,[{siteId:'site',date:'2026-09-21',type:'local'}],'2026-09-18');
    expect(home.decisions).toEqual([expect.objectContaining({label:'Corrección del 2026-09-20',href:'/manager/corrections/correction'})]);
    expect(home.exceptions).toEqual(expect.arrayContaining([expect.objectContaining({label:'Festivo local'}),expect.objectContaining({label:'Vacaciones aprobadas'})]));
    expect(JSON.stringify(home)).not.toContain('No debe aparecer');
  });
});

describe('bandeja de atención del responsable',()=>{
  it('ordena por solicitud y no propaga motivos ni comentarios personales',()=>{
    const items=managerAttentionItems([{id:'later',siteId:'site-a',employeeId:'employee',laborDate:'2026-09-20',status:'pending',reason:'No debe aparecer',requestedAt:'2026-09-19T10:00:00.000Z'}] as any,[{id:'first',siteId:'site-b',employeeId:'employee',fromDate:'2026-09-18',toDate:'2026-09-19',category:'vacation',comment:'No debe aparecer',status:'pending',requestedAt:'2026-09-18T10:00:00.000Z'}] as any);
    expect(items.map(item=>item.id)).toEqual(['first','later']);
    expect(items[0]).toMatchObject({kind:'leave',label:'Vacaciones',detail:'Del 2026-09-18 al 2026-09-19',href:'/manager/leave-requests'});
    expect(items[1]).toMatchObject({kind:'correction',label:'Corrección pendiente',detail:'Jornada del 2026-09-20',href:'/manager/corrections/later'});
    expect(JSON.stringify(items)).not.toContain('No debe aparecer');
  });
});
