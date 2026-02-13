import { storage } from "./Storage.js";
import { erc721 } from "./ERC721.js";
import { enhance } from "./Enhance.js";
import { gem } from "./Gem.js";
import { setSystem } from "./SetSystem.js";
import { Config } from "./Config.js";
import { bag } from "./Bag.js";
import { AntiCheat } from "./AntiCheat.js";
import { web3eth } from "./Web3.js";
import { economy } from "./Economy.js";

export class Player {
  constructor() {
    AntiCheat.checkDataTamper();
    if(!storage.get("player"))storage.set("player",{equip:{}});
    if(storage.get("gold")==null) storage.set("gold",1000);
    if(storage.get("diamond")==null) storage.set("diamond",100);
  }
  data() { return storage.get("player"); }

  destroyEquip(tokenId) {
    const owner = web3eth.account || "local_guest";
    const nfts = erc721.all();
    const target = nfts.find(n => n.tokenId === tokenId);
    if(!target || target.owner !== owner) return false;

    const p = this.data();
    if(p.equip[target.type] === tokenId) {
      delete p.equip[target.type];
      storage.set("player", p);
    }

    const newNfts = nfts.filter(n => n.tokenId !== tokenId);
    storage.set("nfts", newNfts);
    storage.set(`enh_${tokenId}`, null);
    storage.set(`gem_${tokenId}`, null);
    storage.set(`owner_${tokenId}`, null);

    economy.addGold(Config.game.GOLD_PER_EQUIP_DESTROY || 100);
    AntiCheat.updateHash();
    return true;
  }

  // ==============================
  // 🔥 唯一修复：把 n.type 改成 nft.type
  // ==============================
  equip(tid) {
    const owner = web3eth.account || "local_guest";
    const nft = erc721.all().find(x=>x.tokenId==tid);
    if(!nft) return false;
    if(!AntiCheat.checkEquipSign(owner, nft, nft.sign)){ alert("装备非法"); return false; }
    const p=this.data();
    Object.keys(p.equip).forEach(k=>{
      const t=erc721.all().find(x=>x.tokenId==p.equip[k]);
      if(t?.type==nft.type)delete p.equip[k];
    });
    // 👇 修复这一行！n.type → nft.type
    p.equip[nft.type] = tid; 
    storage.set("player",p); 
    return true;
  }

  unequip(type) { 
    const p=this.data(); 
    if(p.equip[type]){
      delete p.equip[type];
      storage.set("player",p);
    } 
  }

  totalAttr(owner) {
    const a={atk:150,def:80,hp:1500,crit:5};
    const my=erc721.byOwner(owner); 
    const p=this.data();
    my.forEach(n=>{ 
      if(p.equip[n.type]!=n.tokenId)return; 
      const lv=enhance.level(n.tokenId); 
      a.atk+=n.atk*(1+lv*0.1); 
      a.def+=n.def*(1+lv*0.1); 
      a.hp+=n.hp*(1+lv*0.1); 
      gem.slots(n.tokenId).forEach(g=>{
        const m=bag.getGem(g);
        if(m)a[m.type]+=m.value;
      }); 
    });
    const sets=setSystem.countSets(owner);
    Object.keys(sets).forEach(id=>{ 
      const s=Config.sets[id]; 
      if(sets[id]>=2)Object.assign(a,s[2]); 
      if(sets[id]>=4)Object.assign(a,s[4]); 
    });
    return a;
  }
}
export const player = new Player();
