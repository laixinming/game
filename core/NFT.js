import { Config } from "./Config.js";
import { erc721 } from "./ERC721.js";
export class NFT {
  randomDrop(mapId) { const m=Config.maps.find(x=>x.id==mapId); const mon=m.monsters[Math.random()*m.monsters.length|0]; const eid=mon.dropEquipIds[Math.random()*mon.dropEquipIds.length|0]; return Config.equipments.find(x=>x.id==eid); }
  mint(owner,mapId,caller) { return erc721.mint(owner, this.randomDrop(mapId), caller); }
}
export const nft = new NFT();
