import { storage } from "./Storage.js";
import { bag } from "./Bag.js";
export class Gem {
  slots(tid) { return storage.get(`gem_${tid}`) || []; }
  embed(tid,i,gid) { if(!bag.cost(`gem_${gid}`,1))return {success:false,msg:"宝石不足"}; const s=this.slots(tid); s[i]=gid; storage.set(`gem_${tid}`,s); return {success:true,msg:"镶嵌成功"}; }
  take(tid,i) { const s=this.slots(tid); const g=s[i]; if(!g)return {success:false,msg:"无宝石"}; bag.add(`gem_${g}`,1); s[i]=null; storage.set(`gem_${tid}`,s); return {success:true,msg:"已取下"}; }
}
export const gem = new Gem();
