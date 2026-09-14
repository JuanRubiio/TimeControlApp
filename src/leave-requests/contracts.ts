export const LEAVE_REQUEST_STATUSES=['pending','approved','rejected','cancelled'] as const;
export type LeaveRequestStatus=typeof LEAVE_REQUEST_STATUSES[number];
export type LeaveRequest={id:string;employeeId:string;siteId:string;fromDate:string;toDate:string;category:'general_request';status:LeaveRequestStatus;requestedAt:string;decision:{decision:'approved'|'rejected';decidedAt:string}|null;cancelledAt:string|null};
