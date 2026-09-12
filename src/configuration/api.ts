type Envelope<T>={data:T;error?:{message?:string}};
async function request<T>(url:string,init?:RequestInit):Promise<T>{const response=await fetch(url,{credentials:'same-origin',...init});const body=await response.json().catch(()=>null) as Envelope<T>;if(!response.ok)throw new Error(body?.error?.message??'No se pudo completar la operación.');return body.data;}
const create=<T>(url:string,input:unknown,method='POST')=>request<T>(url,{method,headers:{'content-type':'application/json'},body:JSON.stringify(input)});

export type Company={id:string;name:string;legalIdentifier?:string|null};
export type Site={id:string;name:string;timeZone:string};
export type Employee={id:string;displayName:string};
export type Employment={id:string;employeeId:string;siteId:string;managerEmployeeId?:string|null;effectiveFrom:string;effectiveTo?:string|null};
export type Calendar={id:string;name:string;timeZone:string};
export type Shift={id:string;name:string};
export type WorkRule={id:string;name:string;scopeType:'company'|'site'|'collective';scopeId:string;status:string};
export type RuleVersion={id:string;workRuleId:string;effectiveFrom:string;effectiveTo?:string|null};

export const configurationApi={
  company:async()=>{const response=await fetch('/api/v1/companies',{credentials:'same-origin'});if(response.status===404)return undefined;const body=await response.json().catch(()=>null) as Envelope<Company>;if(!response.ok)throw new Error(body?.error?.message??'No se pudo consultar la empresa.');return body.data;}, sites:()=>request<Site[]>('/api/v1/sites'), employees:()=>request<Employee[]>('/api/v1/employees'), employments:()=>request<Employment[]>('/api/v1/employments'),
  calendars:()=>request<Calendar[]>('/api/v1/calendars'), shifts:()=>request<Shift[]>('/api/v1/shifts'), rules:()=>request<WorkRule[]>('/api/v1/work-rules'), versions:()=>request<RuleVersion[]>('/api/v1/rule-versions'),
  createCompany:(input:{name:string;legalIdentifier:string|null})=>create<Company>('/api/v1/companies',input), saveCompany:(input:{name:string;legalIdentifier:string|null})=>create<Company>('/api/v1/companies',input,'PUT'),
  createSite:(input:{name:string;timeZone:string})=>create<Site>('/api/v1/sites',input), createEmployee:(input:{displayName:string})=>create<Employee>('/api/v1/employees',input),
  createEmployment:(input:{employeeId:string;siteId:string;managerEmployeeId:string|null;effectiveFrom:string;effectiveTo:string|null})=>create<Employment>('/api/v1/employments',input),
  createCalendar:(input:{name:string;timeZone:string;workingDays:number[];holidays:string[]})=>create<Calendar>('/api/v1/calendars',input), createShift:(input:{name:string;segments:{start:string;end:string}[]})=>create<Shift>('/api/v1/shifts',input),
  createRule:(input:{scopeType:'company'|'site';scopeId:string;name:string})=>create<WorkRule>('/api/v1/work-rules',input),
  createVersion:(input:{workRuleId:string;effectiveFrom:string;effectiveTo:string|null;timeZone:string;expectedMinutes:number;pausePolicy:{mode:'manual_visible';autoDeduct:false};calendarId:string|null;shiftId:string|null})=>create<RuleVersion>('/api/v1/rule-versions',input)
};
