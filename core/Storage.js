import { AntiCheat } from "./AntiCheat.js";
const PREFIX = "dark_war_";

export class Storage {
  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    if (["player","gold","diamond","bag","nfts"].includes(key)) {
      AntiCheat.updateHash();
    }
  }
  get(key) {
    const d = localStorage.getItem(PREFIX + key);
    return d ? JSON.parse(d) : null;
  }
  clearAll() {
    for (const k in localStorage) {
      if (k.startsWith(PREFIX)) localStorage.removeItem(k);
    }
  }
}
export const storage = new Storage();
