import { storage } from "./Storage.js";
import { erc721 } from "./ERC721.js";
import { diamond } from "./Diamond.js";
export class Market {
  getAllBooths() { return storage.get("booths")||[]; }
  onShelf(tid,price,seller) { if(erc721.owner(tid)!==seller)return {success:false,msg:"非本人"}; const e=erc721.all().find(x=>x.tokenId===tid); const bs=this.getAllBooths(); let b=bs.find(o=>o.addr===seller); if(!b){b={addr:seller,name:"摊位",items:[]};bs.push(b);} b.items.push({tid,name:e.name,price,seller}); storage.set("booths",bs); return {success:true,msg:"上架成功"}; }
  buyItem(tid,buyer) {
    const bs=this.getAllBooths(); let it=null,b=null; for(const o of bs){const i=o.items.find(x=>x.tid===tid);if(i){it=i;b=o;break;}}
    if(!it)return {success:false,msg:"已下架"}; if(it.seller===buyer)return {success:false,msg:"不能买自己"}; if(!diamond.cost(it.price))return {success:false,msg:"钻石不足"};
    storage.set(`owner_${tid}`,buyer); storage.set(`diamond_${it.seller}`,(storage.get(`diamond_${it.seller}`)||0)+it.price);
    b.items=b.items.filter(x=>x.tid!==tid); storage.set("booths",bs); return {success:true,msg:"购买成功"};
  }
}
export const market = new Market();
