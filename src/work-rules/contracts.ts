export type RuleScopeType = 'company' | 'site' | 'collective';
export type RuleScope = { type: RuleScopeType; id: string };
export type ShiftSegment = { start: string; end: string };
export type PausePolicy = { mode: 'manual_visible'; autoDeduct: false; minimumMinutes?: number };
export type CalendarSnapshot = { id: string; name: string; timeZone: string; workingDays: number[]; holidays: string[] };
export type ShiftSnapshot = { id: string; name: string; segments: ShiftSegment[] };
export type ResolvedRule = {
  ruleId: string; ruleVersionId: string; scope: RuleScope; effectiveFrom: string; effectiveTo: string | null;
  timeZone: string; expectedMinutes: number; pausePolicy: PausePolicy; calendar: CalendarSnapshot | null; shift: ShiftSnapshot | null;
};
export type RuleResolverInput = { occurredAt: string; effectiveTimeZone: string; scopes: readonly RuleScope[] };
export interface RuleResolver { resolve(input: RuleResolverInput): Promise<ResolvedRule | null>; }

/**
 * Puerto de S2 para resolver de forma atómica la relación laboral aplicable.
 * `occurredAt` es un instante ISO-8601 UTC; no se aceptan fechas locales ambiguas.
 * Los colectivos no se incluyen hasta que su modelo tenga una sesión propietaria.
 */
export type EmploymentContext = { employmentId: string; companyId: string; siteId: string; effectiveTimeZone: string; scopes: readonly RuleScope[] };
export interface EmploymentScopeProvider { contextForEmployee(employeeId: string, occurredAt: string): Promise<EmploymentContext | null>; }
