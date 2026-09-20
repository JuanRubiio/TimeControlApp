export const CLOCKING_POLICY_METHODS=['web','geo_punctual'] as const;
export type ClockingPolicyMethod=typeof CLOCKING_POLICY_METHODS[number];
export type GeoVerification={latitude:number;longitude:number;accuracy:number};
export type EffectiveClockingPolicy={method:ClockingPolicyMethod;policyId?:string;zoneLabel?:string;requiresPunctualLocation:boolean};
export type SiteClockingPolicy={id:string;siteId:string;method:ClockingPolicyMethod;locationZoneId:string|null;effectiveFrom:string;effectiveTo:string|null;zoneLabel:string|null};
