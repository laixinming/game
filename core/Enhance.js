import { storage } from "./Storage.js";
import { bag } from "./Bag.js";
export class Enhance {
  level(tid) { return storage.get(`enh_${tid}`) || 0; }
  upgradeByStone(tid, max) {
    const lv=this.level(tid); if(lv>=max)return {success:false,msg:"已满级"};
    if(!bag.cost("enhance_stone",1))return {success:false,msg:"强化石不足"};
    storage.set(`enh_${tid}`, lv+1); return {success:true,msg:`+${lv+1}成功`};
  }
}
export const enhance = new Enhance();
