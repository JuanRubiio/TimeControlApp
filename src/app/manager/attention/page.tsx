import { ManagerAttention } from '@/manager/attention';

export default async function ManagerAttentionPage({searchParams}:{searchParams:Promise<{type?:string}>}){const {type}=await searchParams;return <ManagerAttention initialType={type==='correction'||type==='leave'?type:'all'}/>;}
