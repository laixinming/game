import { debounce } from "../core/Utils.js";

export class Render {
  static init() {
    this.nftList();
    // 给分解按钮绑点击事件
    document.getElementById("decomposeBtn").onclick = this.doDecompose;
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
        <button id="decomposeBtn">分解</button>
      </div>
    `;
  }

  // 分解功能（修复后，点击必触发）
  static doDecompose = () => {
    if(confirm("确定分解装备？获得100金币")){
      alert("分解成功！+100金币");
      $("#nftlist").html(`<div class="card"><h3>装备已分解</h3><p>已获得100金币</p></div>`);
    }
  };

  static combat = () => {
    alert("去战斗");
  };

  static marketPage = () => {
    alert("集市");
  };

  static back = () => {
    $("#main").innerHTML = $("#home_html").innerHTML;
  };
}

window.$ = s => document.querySelector(s);
