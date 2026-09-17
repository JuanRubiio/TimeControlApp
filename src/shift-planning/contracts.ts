export type ShiftPlanningModuleStatus = 'disabled' | 'configured' | 'active' | 'paused';
export type PlannedTemplateStatus = 'draft' | 'published' | 'retired';
export type PlannedAssignmentStatus = 'draft' | 'published' | 'cancelled' | 'superseded';

export type ShiftSegment = { start: string; end: string };

export type PlannedTemplate = {
  id: string; name: string; version: number; status: PlannedTemplateStatus;
  timeZone: string; segments: ShiftSegment[]; expectedMinutes: number;
};

export type PlanningEmployment = {
  id: string; displayName: string; siteName: string; effectiveFrom: string; effectiveTo: string | null;
};

export type PlannedAssignment = {
  id: string; employmentId: string; siteId: string; templateId: string;
  effectiveFrom: string; effectiveTo: string | null; status: PlannedAssignmentStatus;
};
