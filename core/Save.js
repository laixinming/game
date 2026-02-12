import { storage } from "./Storage.js";
import { web3eth } from "./Web3.js";
import { AntiCheat } from "./AntiCheat.js";

export class Save {
  async export() {
    const account = web3eth.account || "local";
    const data = {
      player: storage.get("player"), gold: storage.get("gold"),
      diamond: storage.get("diamond"), bag: storage.get("bag"), nfts: storage.get("nfts")
    };
    const extra = {};
    for(const k in localStorage){
      if(k.includes("enh_")||k.includes("gem_")||k.includes("owner_")){
        extra[k] = storage.get(k.replace("dark_war_",""));
      }
    }
    data.extra = extra;
    const str = JSON.stringify(data);
    const sign = await web3eth.signMessage(str);
    const saveStr = btoa(JSON.stringify({data:str, sign, account}));
    const blob = new Blob([saveStr],{type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `暗黑战神-${account.slice(0,6)}.txt`;
    a.href=url; a.click(); URL.revokeObjectURL(url);
    alert("导出成功");
  }
  async importFromText(text) {
    try {
      const {data, sign, account} = JSON.parse(atob(text));
      const rec = await web3eth.verify(data, sign);
      if(!rec || rec.toLowerCase()!==account.toLowerCase()){
        alert("存档非法"); return;
      }
      const d = JSON.parse(data);
      storage.clearAll();
      if(d.player) storage.set("player",d.player);
      if(d.gold!=null) storage.set("gold",d.gold);
      if(d.diamond!=null) storage.set("diamond",d.diamond);
      if(d.bag) storage.set("bag",d.bag);
      if(d.nfts) storage.set("nfts",d.nfts);
      if(d.extra) Object.keys(d.extra).forEach(k=>storage.set(k,d.extra[k]));
      AntiCheat.updateHash();
      alert("导入成功，刷新");
      location.reload();
    }catch(e){alert("格式错误");}
  }
}
export const save = new Save();
