import { randomUUID } from 'node:crypto';
import { repairCalculationHistory } from '../src/time-calculation/outbox';

const employeeId=process.env.S19_REPAIR_EMPLOYEE_ID;
const laborDate=process.env.S19_REPAIR_LABOR_DATE;
if(process.env.S19_REPAIR_CONFIRMATION!=='AUTHORIZED_REPAIR'||!employeeId||!laborDate||!/^\d{4}-\d{2}-\d{2}$/.test(laborDate)) throw new Error('Se exige confirmación, empleado y fecha laboral para una reparación S19 autorizada.');
repairCalculationHistory({employeeId,laborDate,correlationId:randomUUID()}).then(result=>console.log(JSON.stringify({repaired:true,replayed:result.replayed}))).catch(error=>{console.error(error instanceof Error?error.message:'REPAIR_FAILED');process.exitCode=1;});
