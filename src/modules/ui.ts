'use client';

import { useEffect,useState } from 'react';
import type { ModuleKey } from './catalog';

type Availability={active:string[]};
const eventName='timecontrol:modules-changed';

export function moduleAvailabilityChanged(){window.dispatchEvent(new Event(eventName));}

export function useModuleEnabled(key:ModuleKey){
  const [active,setActive]=useState<string[]>([]);
  useEffect(()=>{
    let current=true;
    const load=()=>fetch('/api/v1/modules/availability',{credentials:'same-origin'})
      .then(async response=>{if(!response.ok)throw new Error('MODULE_AVAILABILITY_UNAVAILABLE');return response.json() as Promise<{data:Availability}>;})
      .then(value=>{if(current)setActive(value.data.active);})
      .catch(()=>{if(current)setActive([]);});
    void load();
    window.addEventListener(eventName,load);
    return ()=>{current=false;window.removeEventListener(eventName,load);};
  },[]);
  return active.includes(key);
}
