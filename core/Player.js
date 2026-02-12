import { storage } from "./Storage.js";
import { erc721 } from "./ERC721.js";
import { enhance } from "./Enhance.js";
import { gem } from "./Gem.js";
import { setSystem } from "./SetSystem.js";
import { Config } from "./Config.js";
import { bag } from "./Bag.js";
import { AntiCheat } from "./AntiCheat.js";
import { web3eth } from "./Web3.js";

export class Player {
  constructor() {
    AntiCheat.checkDataTamper();
    if(!storage.get("player"))storage.set("player",{equip:{}});
  }
  data() { return storage.get("player"); }
  equip(tid) {
    const owner = web3eth.account || "local";
    const nft = erc721.all().find(x=>x.tokenId==tid);
    if(!nft) return false;
    if(!AntiCheat.checkEquipSign(owner, nft, nft.sign)){
      alert("装备非法，无法穿戴"); return false;
    }
    const p=this.data();
    Object.keys(p.equip).forEach(k=>{
      const t=erc721.all().find(x=>x.tokenId==p.equip[k]);
      if(t?.type==nft.type)delete p.equip[k];
    });
    p.equip[nft.type]=tid; storage.set("player",p); return true;
  }
  unequip(type) { const p=this.data(); if(p.equip[type]){delete p.equip[type];storage.set("player",p);} }
  totalAttr(owner) {
    const a={atk:100,def:50,hp:1000,crit:5};
    const my=erc721.byOwner(owner); const p=this.data();
    my.forEach(n=>{ if(p.equip[n.type]!=n.tokenId)return; const lv=enhance.level(n.tokenId); a.atk+=n.atk*(1+lv*0.1); a.def+=n.def*(1+lv*0.1); a.hp+=n.hp*(1+lv*0.1); gem.slots(n.tokenId).forEach(g=>{const m=bag.getGem(g);if(m)a[m.type]+=m.value;}); });
    const sets=setSystem.countSets(owner);
    Object.keys(sets).forEach(id=>{ const s=Config.sets[id]; if(sets[id]>=2)Object.assign(a,s[2]); if(sets[id]>=4)Object.assign(a,s[4]); });
    return a;
  }
}
export const player = new Player();
