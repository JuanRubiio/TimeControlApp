type Envelope<T>={data:T;error?:{message?:string}};
async function request<T>(url:string,init?:RequestInit):Promise<T>{const response=await fetch(url,{credentials:'same-origin',...init});const body=await response.json().catch(()=>null) as Envelope<T>;if(!response.ok)throw new Error(body?.error?.message??'No se pudo completar la operación.');return body.data;}
const create=<T>(url:string,input:unknown,method='POST')=>request<T>(url,{method,headers:{'content-type':'application/json'},body:JSON.stringify(input)});

export type Company={id:string;name:string;legalIdentifier?:string|null};
export type Site={id:string;name:string;timeZone:string};
export type Employee={id:string;displayName:string};
export type Employment={id:string;employeeId:string;siteId:string;managerEmployeeId?:string|null;effectiveFrom:string;effectiveTo?:string|null};
export type WorkLocationZone={id:string;label:string;latitude:number;longitude:number;radiusMeters:number};
export type ClockingPolicy={id:string;employmentId:string;method:'web'|'geo_punctual';locationZoneId?:string|null;reasonCode:'fixed_site'|'approved_mobility';effectiveFrom:string;effectiveTo?:string|null;zoneLabel?:string|null};
export type SiteClockingPolicy={id:string;siteId:string;method:'web'|'geo_punctual';locationZoneId?:string|null;effectiveFrom:string;effectiveTo?:string|null;zoneLabel?:string|null};
export type Calendar={id:string;name:string;timeZone:string};
export type Shift={id:string;name:string};
export type WorkRule={id:string;name:string;scopeType:'company'|'site'|'collective';scopeId:string;status:string};
export type RuleVersion={id:string;workRuleId:string;effectiveFrom:string;effectiveTo?:string|null};
export type OnboardingRow={rowId:string;displayName:string;siteId:string;managerEmployeeId:string|null;effectiveFrom:string};
export type OnboardingPreview={rowId:string;status:'ready'|'needs_review'|'error';messages:string[]};

export const configurationApi={
  company:async()=>{const response=await fetch('/api/v1/companies',{credentials:'same-origin'});if(response.status===404)return undefined;const body=await response.json().catch(()=>null) as Envelope<Company>;if(!response.ok)throw new Error(body?.error?.message??'No se pudo consultar la empresa.');return body.data;}, sites:()=>request<Site[]>('/api/v1/sites'), employees:()=>request<Employee[]>('/api/v1/employees'), employments:()=>request<Employment[]>('/api/v1/employments'), zones:()=>request<WorkLocationZone[]>('/api/v1/work-location-zones'), policies:()=>request<ClockingPolicy[]>('/api/v1/clocking-policies'), sitePolicies:()=>request<SiteClockingPolicy[]>('/api/v1/site-clocking-policies'),
  calendars:()=>request<Calendar[]>('/api/v1/calendars'), shifts:()=>request<Shift[]>('/api/v1/shifts'), rules:()=>request<WorkRule[]>('/api/v1/work-rules'), versions:()=>request<RuleVersion[]>('/api/v1/rule-versions'),
  createCompany:(input:{name:string;legalIdentifier:string|null})=>create<Company>('/api/v1/companies',input), saveCompany:(input:{name:string;legalIdentifier:string|null})=>create<Company>('/api/v1/companies',input,'PUT'),
  createSite:(input:{name:string;timeZone:string})=>create<Site>('/api/v1/sites',input), createEmployee:(input:{displayName:string})=>create<Employee>('/api/v1/employees',input),
  createEmployment:(input:{employeeId:string;siteId:string;managerEmployeeId:string|null;effectiveFrom:string;effectiveTo:string|null})=>create<Employment>('/api/v1/employments',input), createZone:(input:{label:string;latitude:number;longitude:number;radiusMeters:number})=>create<WorkLocationZone>('/api/v1/work-location-zones',input), deleteZone:(id:string)=>request<WorkLocationZone>(`/api/v1/work-location-zones/${id}`,{method:'DELETE'}), createSitePolicy:(input:{siteId:string;method:'web'|'geo_punctual';locationZoneId:string|null;effectiveFrom:string;effectiveTo:string|null})=>create<SiteClockingPolicy>('/api/v1/site-clocking-policies',input), createClockingPolicy:(input:{employmentId:string;method:'web'|'geo_punctual';locationZoneId:string|null;reasonCode:'fixed_site'|'approved_mobility';effectiveFrom:string;effectiveTo:string|null})=>create<ClockingPolicy>('/api/v1/clocking-policies',input), replaceClockingPolicy:(id:string,input:{employmentId:string;method:'web'|'geo_punctual';locationZoneId:string|null;reasonCode:'fixed_site'|'approved_mobility';effectiveFrom:string;effectiveTo:string|null})=>create<ClockingPolicy>(`/api/v1/clocking-policies/${id}`,input,'PUT'),
  createCalendar:(input:{name:string;timeZone:string;workingDays:number[];holidays:string[]})=>create<Calendar>('/api/v1/calendars',input), createShift:(input:{name:string;segments:{start:string;end:string}[]})=>create<Shift>('/api/v1/shifts',input),
  createRule:(input:{scopeType:'company'|'site';scopeId:string;name:string})=>create<WorkRule>('/api/v1/work-rules',input),
  createVersion:(input:{workRuleId:string;effectiveFrom:string;effectiveTo:string|null;timeZone:string;expectedMinutes:number;pausePolicy:{mode:'manual_visible';autoDeduct:false};calendarId:string|null;shiftId:string|null})=>create<RuleVersion>('/api/v1/rule-versions',input),
  previewOnboarding:(rows:OnboardingRow[])=>create<{rows:OnboardingPreview[]}>('/api/v1/onboarding/preview',{rows}),confirmOnboarding:(row:OnboardingRow,key:string)=>request<{employeeId:string;employmentId:string;replayed:boolean}>('/api/v1/onboarding/confirm',{method:'POST',headers:{'content-type':'application/json','idempotency-key':key},body:JSON.stringify(row)})
};
