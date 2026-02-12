import { erc721 } from "./ERC721.js";
export class SetSystem {
  countSets(o) { const c={}; erc721.byOwner(o).forEach(n=>{if(n.setId)c[n.setId]=(c[n.setId]||0)+1}); return c; }
}
export const setSystem = new SetSystem();
