// 全局暴露分解方法，让HTML onclick直接能找到
window.doDecompose = function() {
  if(confirm("确定分解装备？获得100金币")){
    alert("分解成功！+100金币");
    document.getElementById("nftlist").innerHTML = `
      <div class="card">
        <h3>装备已分解</h3>
        <p>已获得100金币</p>
      </div>
    `;
  }
}

export class Render {
  static init() {
    this.nftList();
  }

  static nftList() {
    // 🔥 直接用原生 onclick，不绕任何弯
    document.getElementById("nftlist").innerHTML = `
      <div class="card">
        <h3>正常装备</h3>
        <p>攻100 防50</p>
        <button>强化</button>
        <button>宝石</button>
        <button>穿戴</button>
        <button>摆摊</button>
        <button onclick="doDecompose()">分解</button>
      </div>
    `;
  }

  // 空方法，不影响
  static refresh = () => {};
  static combat = () => alert("去战斗");
  static marketPage = () => alert("集市");
  static back = () => {};
}

window.$ = s => document.querySelector(s);
