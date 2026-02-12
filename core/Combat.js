import { nft } from "./NFT.js";
import { web3eth } from "./Web3.js";

export class Combat {
  fight(mapId) {
    const caller = "GAME_UI_TRIGGER";
    // 游客使用本地身份
    const owner = web3eth.account || "local_guest";
    const tid = nft.mint(owner, mapId, caller);
    if(!tid) return {success:false};
    const equip = erc721.all().find(x=>x.tokenId===tid);
    return {success:true, equip};
  }
}
export const combat = new Combat();
