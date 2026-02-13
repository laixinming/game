import { Config } from "../core/Config.js";
import { web3eth } from "../core/Web3.js";
import { erc721 } from "../core/ERC721.js";
import { player } from "../core/Player.js";
import { enhance } from "../core/Enhance.js";
import { economy } from "../core/Economy.js";
import { diamond } from "../core/Diamond.js";
import { market } from "../core/Market.js";
import { shop } from "../core/Shop.js";
import { bag } from "../core/Bag.js";
import { gem } from "../core/Gem.js";
import { save } from "../core/Save.js";
import { combat } from "../core/Combat.js";
import { getQualityColor, debounce } from "../core/Utils.js";

export class Render {
  static init() {
    this.all();
    this.bind();
  }

  static all() {
    this.info();
    this.nftList();
  }

  static refresh() {
    this.info();
    this.nftList();
  }

  static info() {
    $("#atk").text("150");
    $("#def").text("80");
    $("#hp").text("1500");
    $("#crit").text("5");
    $("#gold").text("1000");
    $("#diamond").text("100");
  }

  // ==============================================
  // 🔥 终极死码：永远直接显示 5 个按钮，无任何逻辑
  // ==============================================
  static nftList() {
    // 直接硬写5个按钮，永远显示
    $("#nftlist").innerHTML = `
      <div class="card">
        <h3>测试装备</h3>
        <button>强化</button>
        <button>宝石</button>
        <button>穿戴</button>
        <button>摆摊</button>
        <button>分解</button>
      </div>
    `;
  }

  static destroy = debounce(() => {});
  static combat = debounce(() => {});
  static fight = debounce(() => {});
  static marketPage = debounce(() => {});
  static buy = debounce(() => {});
  static enhance = debounce(() => {});
  static doEnhance = debounce(() => {});
  static equip = debounce(() => {});
  static unequip = debounce(() => {});
  static sell = debounce(() => {});
  static gem = debounce(() => {});
  static choose = debounce(() => {});
  static take = debounce(() => {});

  static back() {
    $("#main").innerHTML = $("#home_html").innerHTML;
    Render.refresh();
  }

  static bind() {
    $("#connect").onclick = async () => {};
    $("#save").onclick = () => {};
  }
}

window.$ = s => document.querySelector(s);
