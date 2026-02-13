import { Config } from "./Config.js";
import { erc721 } from "./ERC721.js";
export class NFT {
  randomDrop(mapId) {
    const m = Config.maps.find(x => x.id == mapId);
    const mon = m.monsters[Math.floor(Math.random() * m.monsters.length)];
    const eid = mon.dropEquipIds[Math.floor(Math.random() * mon.dropEquipIds.length)];
    const equip = Config.equipments.find(x => x.id == eid);
    // 修复：保证返回的装备一定有 type
    return { ...equip, type: equip.type || "武器" };
  }
  mint(owner, mapId) {
    return erc721.mint(owner, this.randomDrop(mapId));
  }
}
export const nft = new NFT();
