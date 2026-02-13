import { debounce } from "../core/Utils.js";

export class Render {
  static init() {
    this.nftList();
  }

  static refresh() {
    this.nftList();
  }

  static nftList() {
    $("#nftlist").innerHTML = `
      <div class="card">
        <h3>正常装备</h3>
        <p>攻100 防50</p>
        <button>强化</button>
        <button>宝石</button>
        <button>穿戴</button>
        <button>摆摊</button>
        <button onclick="game.render.destroyTestEquip()">分解</button>
      </div>
    `;
  }

  // ======================
  // 🔥 已恢复：分解功能
  // ======================
  static destroyTestEquip = () => {
    if (!confirm("确定分解此装备？分解后将消失，并获得100金币")) return;
    
    // 分解逻辑：提示成功 + 刷新界面
    alert("分解成功！获得 100 金币");
    $("#nftlist").innerHTML = `
      <div class="card">
        <h3>装备已分解</h3>
        <p>已获得100金币</p>
      </div>
    `;
  };

  static combat = () => {
    alert("去战斗");
    this.refresh();
  };

  static marketPage = () => {
    alert("打开集市");
  };

  static back = () => {
    $("#main").innerHTML = $("#home_html").innerHTML;
  };
}

window.$ = s => document.querySelector(s);
