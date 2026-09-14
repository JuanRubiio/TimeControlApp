export const LEAVE_REQUEST_STATUSES=['pending','approved','rejected','cancelled'] as const;
export type LeaveRequestStatus=typeof LEAVE_REQUEST_STATUSES[number];
export const LEAVE_REQUEST_MANAGER_STATUSES=['pending','approved','rejected'] as const;
export type LeaveRequestManagerStatus=typeof LEAVE_REQUEST_MANAGER_STATUSES[number];
export const LEAVE_REQUEST_CATEGORIES=['general_request','personal_management','availability_adjustment'] as const;
export type LeaveRequestCategory=typeof LEAVE_REQUEST_CATEGORIES[number];
export type LeaveRequest={id:string;employeeId:string;siteId:string;fromDate:string;toDate:string;category:LeaveRequestCategory;comment:string|null;status:LeaveRequestStatus;requestedAt:string;decision:{decision:'approved'|'rejected';decidedAt:string}|null;cancelledAt:string|null};
