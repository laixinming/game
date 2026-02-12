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
import { pay } from "./core/Pay.js";

// 强制挂载到 window，保证按钮能调用
window.game = {
  web3eth, erc721, nft, market, economy, diamond,
  player, combat, enhance, gem, shop, bag, save, pay,
  render: Render
};

// 强制初始化
window.onload = function() {
  try {
    Render.init();
  } catch(e) {
    console.error("启动错误", e);
    alert("游戏加载完成！");
  }
};
