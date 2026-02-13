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
    const acc = web3eth.account || "local_guest";
    const a = player.totalAttr(acc);
    $("#atk").text(Math.floor(a.atk));
    $("#def").text(Math.floor(a.def));
    $("#hp").text(Math.floor(a.hp));
    $("#crit").text(Math.floor(a.crit));
    $("#gold").text(economy.gold());
    $("#diamond").text(diamond.get());
  }

  // ==============================================
  // 🔥 绝对安全版：无模板字符串、无三元、无中断
  // ==============================================
  static nftList() {
    const acc = web3eth.account || "local_guest";
    const list = erc721.byOwner(acc);
    const p = player.data();
    let html = '';

    if (list.length === 0) {
      $("#nftlist").innerHTML = "<p>点击【去战斗】获取装备</p>";
      return;
    }

    for (let i = 0; i < list.length; i++) {
      let n = list[i];
      let lv = enhance.level(n.tokenId);

      // 卡片开头
      html += '<div class="card">';
      html += '<h3>' + n.name + '+' + lv + '</h3>';
      html += '<p>攻' + n.atk + ' 防' + n.def + ' 孔' + n.gemSlots + '</p>';

      // 🔥 5 个按钮，全部用最简单的字符串拼接，100%显示
      html += '<button onclick="game.render.enhance(\'' + n.tokenId + '\',' + n.maxEnhance + ')">强化</button>';
      html += '<button onclick="game.render.gem(\'' + n.tokenId + '\')">宝石</button>';

      // 穿戴/卸下
      if (p.equip[n.type] == n.tokenId) {
        html += '<button onclick="game.render.unequip(\'' + n.type + '\')">卸下</button>';
      } else {
        html += '<button onclick="game.render.equip(\'' + n.tokenId + '\')">穿戴</button>';
      }

      html += '<button onclick="game.render.sell(\'' + n.tokenId + '\')">摆摊</button>';
      html += '<button onclick="game.render.destroy(\'' + n.tokenId + '\')">分解</button>';

      html += '</div>';
    }

    $("#nftlist").innerHTML = html;
  }

  static destroy = debounce((tokenId) => {
    if (!confirm("确定分解？返还100金币")) return;
    player.destroyEquip(tokenId);
    alert("分解成功！");
    Render.refresh();
  });

  static combat = debounce(() => {
    let html = '';
    for (let m of Config.maps) {
      html += '<div class="card"><h3>' + m.name + '</h3>';
      html += '<button onclick="game.render.fight(' + m.id + ')">挑战</button></div>';
    }
    $("#main").innerHTML = `
      <div class="page">
        <div class="title">选择地图</div>
        <button class="back" onclick="game.render.back()">返回</button>
        <div class="grid">`+ html +`</div>
      </div>`;
  });

  static fight = debounce((id) => {
    const r = combat.fight(id);
    alert("获得：" + r.equip.name);
    Render.refresh();
    Render.back();
  });

  static marketPage = debounce(() => {
    let h = "";
    market.getAllBooths().forEach(b => {
      b.items.forEach(it => {
        h += '<div class="card"><h4>'+it.name+'</h4><p>'+it.price+'钻</p>';
        h += '<button onclick="game.render.buy(\''+it.tid+'\')">购买</button></div>';
      });
    });
    $("#main").innerHTML = `
      <div class="page">
        <div class="title">集市</div>
        <button class="back" onclick="game.render.back()">返回</button>
        <div class="grid">`+ h +`</div>
      </div>`;
  });

  static buy = debounce((tid) => {
    const r = market.buyItem(tid, web3eth.account || "local_guest");
    alert(r.msg);
    Render.refresh();
  });

  static enhance = debounce((tid, max) => {
    $("#main").innerHTML = `
      <div class="page">
        <div class="title">强化</div>
        <button class="back" onclick="game.render.back()">返回</button>
        <div class="panel">
          <p>等级+${enhance.level(tid)}</p>
          <p>强化石：${bag.count("enhance_stone")}</p>
          <button onclick="game.render.doEnhance('${tid}',${max})">强化</button>
        </div>
      </div>`;
  });

  static doEnhance = debounce((tid, max) => {
    const r = enhance.upgradeByStone(tid, max);
    alert(r.msg);
    Render.refresh();
    Render.back();
  });

  static equip = debounce((tid) => {
    player.equip(tid);
    Render.refresh();
    Render.back();
  });

  static unequip = debounce((type) => {
    player.unequip(type);
    Render.refresh();
    Render.back();
  });

  static sell = debounce((tid) => {
    const p = prompt("售价(钻石):", "100");
    if (p && !isNaN(p)) {
      market.onShelf(tid, Number(p), web3eth.account || "local_guest");
      alert("上架成功");
      Render.refresh();
    }
  });

  static gem = debounce((tid) => {
    const n = erc721.all().find(x => x.tokenId == tid);
    const s = gem.slots(tid);
    let h = "";
    for (let i = 0; i < n.gemSlots; i++) {
      const g = s[i];
      const name = g ? (bag.getGem(g)?.name || "宝石") : "空";
      if (g) {
        h += '<div class="slot"><p>孔'+(i+1)+'：'+name+'</p><button onclick="game.render.take(\''+tid+'\','+i+')">取下</button></div>';
      } else {
        h += '<div class="slot"><p>孔'+(i+1)+'：'+name+'</p><button onclick="game.render.choose(\''+tid+'\','+i+')">镶嵌</button></div>';
      }
    }
    $("#main").innerHTML = `
      <div class="page">
        <div class="title">宝石</div>
        <button class="back" onclick="game.render.back()">返回</button>
        <div class="panel">`+ h +`</div>
      </div>`;
  });

  static choose = debounce((tid, i) => {
    const list = bag.getAllGems();
    if (!list.length) { alert("无宝石"); return; }
    const id = prompt("宝石ID：\n" + list.map(g => g.id).join(","));
    if (id) {
      gem.embed(tid, i, id);
      alert("镶嵌成功");
      Render.refresh();
    }
  });

  static take = debounce((tid, i) => {
    gem.take(tid, i);
    alert("取下成功");
    Render.refresh();
  });

  static back() {
    $("#main").innerHTML = $("#home_html").innerHTML;
    Render.refresh();
  }

  static bind() {
    $("#connect").onclick = async () => {
      await web3eth.connect();
      Render.refresh();
    };
    $("#save").onclick = debounce(async () => {
      const o = prompt("1=导出 2=导入");
      if (o == 1) await save.export();
      if (o == 2) $("#fileInput").click();
    });
    $("#fileInput").onchange = (e) => {
      const r = new FileReader();
      r.onload = async (ev) => {
        await save.importFromText(ev.target.result);
      };
      r.readAsText(e.target.files[0]);
    };
  }
}

window.$ = s => document.querySelector(s);
