import { storage } from "./Storage.js";
import { Config } from "./Config.js";
export class Bag {
  getBag() { return storage.get("bag") || {}; }
  add(key, count=1) { const b=this.getBag(); b[key]=(b[key]||0)+count; storage.set("bag",b); }
  cost(key, count=1) { const b=this.getBag(); if(!b[key]||b[key]<count)return false; b[key]-=count; if(b[key]<=0)delete b[key]; storage.set("bag",b); return true; }
  count(key) { return this.getBag()[key] || 0; }
  getGem(gid) { return Config.gems.find(g=>g.id===gid); }
  getAllGems() {
    const b=this.getBag(), g=[];
    for(const k in b) if(k.startsWith("gem_")){ const id=k.replace("gem_",""); const m=this.getGem(id); if(m)g.push({...m,key:k,count:b[k]}); }
    return g;
  }
}
export const bag = new Bag();
