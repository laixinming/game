import { storage } from "./Storage.js";
import { Hash } from "./Hash.js";

const ANTI_CHEAT_SALT = "DARK_WAR_ANTI_CHEAT_2026";

export class AntiCheat {
  static generateDataHash() {
    const data = {
      player: storage.get("player"),
      gold: storage.get("gold"),
      diamond: storage.get("diamond"),
      bag: storage.get("bag"),
      nfts: storage.get("nfts"),
      salt: ANTI_CHEAT_SALT
    };
    return Hash.md5(JSON.stringify(data));
  }

  static checkDataTamper() {
    const saved = storage.get("data_hash");
    if (!saved) { storage.set("data_hash", this.generateDataHash()); return true; }
    const now = this.generateDataHash();
    if (now !== saved) {
      alert("数据已篡改，游戏重置");
      storage.clearAll();
      location.reload();
      return false;
    }
    return true;
  }

  static generateEquipSign(owner, data) {
    return Hash.md5(`${owner}_${JSON.stringify(data)}_${ANTI_CHEAT_SALT}`);
  }

  static checkEquipSign(owner, data, sign) {
    return sign && this.generateEquipSign(owner, data) === sign;
  }

  static checkCaller(caller) {
    return caller === "GAME_UI_TRIGGER";
  }

  static updateHash() {
    storage.set("data_hash", this.generateDataHash());
  }
}
