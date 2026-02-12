import { storage } from "./Storage.js";
import { uuid } from "./Utils.js";
import { AntiCheat } from "./AntiCheat.js";

export class ERC721 {
  mint(owner, data, caller) {
    // 游客模式放行，仅非游客校验调用权限
    if(owner !== "local_guest" && !AntiCheat.checkCaller(caller)) {
      alert("禁止非法生成装备");
      return null;
    }
    const tokenId = uuid(owner);
    // 游客不生成签名，仅钱包用户生成装备签名
    const sign = owner !== "local_guest" ? AntiCheat.generateEquipSign(owner, data) : "guest_sign";
    const nft = { tokenId, ...data, sign };
    const list = this.all();
    list.push(nft);
    storage.set("nfts", list);
    storage.set(`owner_${tokenId}`, owner);
    return tokenId;
  }

  owner(tid) { return storage.get(`owner_${tid}`); }
  all() { return storage.get("nfts") || []; }
  byOwner(o) { return this.all().filter(n => this.owner(n.tokenId) === o); }
}
export const erc721 = new ERC721();
