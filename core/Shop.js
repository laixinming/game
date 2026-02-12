import { Config } from "./Config.js";
import { economy } from "./Economy.js";
import { diamond } from "./Diamond.js";
import { bag } from "./Bag.js";
export class Shop {
  constructor() { this.packages=Config.shop.packages; }
  buyPackage(id) {
    const p=this.packages.find(x=>x.id===id); if(!p)return {success:false,msg:"不存在"};
    this.giveItems(p.items); diamond.add(p.diamond||0);
    return {success:true,msg:`购买${p.name}成功`};
  }
  giveItems(items) {
    items.forEach(it=>{
      switch(it.type){
        case "gold": economy.addGold(it.value); break;
        case "diamond": diamond.add(it.value); break;
        case "enhance_stone": bag.add("enhance_stone", it.count); break;
        case "gem": bag.add(`gem_${it.id}`, it.count); break;
      }
    });
  }
}
export const shop = new Shop();
