import { nft } from "./NFT.js";
import { web3eth } from "./Web3.js";
import { erc721 } from "./ERC721.js";

export class Combat {
  fight(mapId) {
    const owner = web3eth.account || "local_guest";
    const tid = nft.mint(owner, mapId);
    const equip = erc721.all().find(x=>x.tokenId===tid);
    return {success:true, equip};
  }
}
export const combat = new Combat();
