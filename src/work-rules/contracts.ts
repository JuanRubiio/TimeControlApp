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

/** Contrato temporal de S2: devuelve referencias activas, no da acceso a sus tablas. */
export interface EmploymentScopeProvider { scopesForEmployee(employeeId: string, at: string): Promise<readonly RuleScope[]>; effectiveTimeZone(employeeId: string, at: string): Promise<string>; }
