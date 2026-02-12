import { storage } from "./Storage.js";
export class Economy {
  gold() { return storage.get("gold") || 0; }
  addGold(v) { storage.set("gold", this.gold() + v); }
  costGold(v) { if (this.gold() < v) return false; storage.set("gold", this.gold() - v); return true; }
}
export const economy = new Economy();
