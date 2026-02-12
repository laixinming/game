import { storage } from "./Storage.js";
import { uuid } from "./Utils.js";
import { AntiCheat } from "./AntiCheat.js";

export class ERC721 {
  mint(owner, data, caller) {
    if (!AntiCheat.checkCaller(caller)) { alert("禁止非法生成装备"); return null; }
    const tokenId = uuid(owner);
    const sign = AntiCheat.generateEquipSign(owner, data);
    const nft = { tokenId, ...data, sign };
    const list = this.all(); list.push(nft);
    storage.set("nfts", list);
    storage.set(`owner_${tokenId}`, owner);
    return tokenId;
  }
  owner(tid) { return storage.get(`owner_${tid}`); }
  all() { return storage.get("nfts") || []; }
  byOwner(o) { return this.all().filter(n => this.owner(n.tokenId) === o); }
}
export const erc721 = new ERC721();
