export const EXPORT_TEMPLATE_VERSION='s9.v1';
export type ExportFormat='csv'|'pdf';
export type ExportScope='employee'|'site';
export type ExportRequest={format:ExportFormat;employeeId?:string;siteId?:string;from:string;to:string};
export type ExportSnapshot={company:string;scope:ExportScope;from:string;to:string;records:Array<{employeeId:string;employee:string;siteId:string;site:string;laborDate:string;timeZone:string;events:Array<{id:string;type:string;occurredAt:string}>;calculation:{id:string;revision:number;effectiveMinutes:number;expectedMinutes:number;breakMinutes:number;incidents:unknown;ruleVersionId:string;ruleName:string;algorithmVersion:string}|null;corrections:Array<{id:string;status:string;reason:string;sourceEventId:string|null;effect:{id:string;type:string;occurredAt:string}|null}>}>};
export type ExportManifest={exportId:string;generatedAt:string;actorId:string;parameters:ExportRequest;templateVersion:string;contentHash:string;snapshotHash:string};
