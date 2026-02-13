import { debounce } from "../core/Utils.js";

export class Render {
  static init() {
    this.nftList();
  }

  static refresh() {
    this.nftList();
  }

  static nftList() {
    // 直接渲染5个按钮，不读任何危险数据
    $("#nftlist").innerHTML = `
      <div class="card">
        <h3>正常装备</h3>
        <p>攻100 防50</p>
        <button>强化</button>
        <button>宝石</button>
        <button>穿戴</button>
        <button>摆摊</button>
        <button onclick="game.render.destroy()">分解</button>
      </div>
    `;
  }

  static destroy = () => {
    alert("分解成功！");
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
