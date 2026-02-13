import { nft } from "./NFT.js";
import { web3eth } from "./Web3.js";
import { erc721 } from "./ERC721.js";

export class Combat {
  fight(mapId) {
    const owner = web3eth.account || "local_guest";
    // 修复：确保掉落装备带全字段，包含 type
    const baseEquip = nft.randomDrop(mapId);
    // 强制补全 type，防止 undefined 报错
    const safeEquip = {
      ...baseEquip,
      type: baseEquip.type || "武器", // 强制给type，永不 undefined
      quality: baseEquip.quality || "普通"
    };
    const tid = erc721.mint(owner, safeEquip);
    const equip = erc721.all().find(x => x.tokenId === tid);
    return { success: true, equip };
  }
}
export const combat = new Combat();
