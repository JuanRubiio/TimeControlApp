'use client';

import { useEffect,useState } from 'react';
import type { ModuleKey } from './catalog';

type Availability={active:string[]};
const eventName='timecontrol:modules-changed';
let cachedActive:string[]|undefined;

export function moduleAvailabilityChanged(){window.dispatchEvent(new Event(eventName));}

export function useModuleEnabled(key:ModuleKey){
  const [active,setActive]=useState<string[]>(()=>cachedActive??[]);
  useEffect(()=>{
    let current=true;
    const load=()=>fetch('/api/v1/modules/availability',{credentials:'same-origin'})
      .then(async response=>{if(!response.ok)throw new Error('MODULE_AVAILABILITY_UNAVAILABLE');return response.json() as Promise<{data:Availability}>;})
      .then(value=>{cachedActive=value.data.active;if(current)setActive(cachedActive);})
      .catch(()=>{if(current)setActive([]);});
    void load();
    window.addEventListener(eventName,load);
    return ()=>{current=false;window.removeEventListener(eventName,load);};
  },[]);
  return active.includes(key);
}
