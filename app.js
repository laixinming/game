import { Render } from "./ui/Render.js";
import { web3eth } from "./core/Web3.js";
import { erc721 } from "./core/ERC721.js";
import { nft } from "./core/NFT.js";
import { market } from "./core/Market.js";
import { economy } from "./core/Economy.js";
import { diamond } from "./core/Diamond.js";
import { player } from "./core/Player.js";
import { combat } from "./core/Combat.js";
import { enhance } from "./core/Enhance.js";
import { gem } from "./core/Gem.js";
import { shop } from "./core/Shop.js";
import { bag } from "./core/Bag.js";
import { save } from "./core/Save.js";

window.game = {
  web3eth, erc721, nft, market, economy, diamond, save,
  player, combat, enhance, gem, shop, bag, render: Render
};

window.addEventListener("DOMContentLoaded", () => Render.init());
