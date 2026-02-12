import { storage } from "./Storage.js";
export class Diamond {
  get() { return storage.get("diamond") || 0; }
  add(v) { storage.set("diamond", this.get() + v); }
  cost(v) { if (this.get() < v) return false; storage.set("diamond", this.get() - v); return true; }
}
export const diamond = new Diamond();
