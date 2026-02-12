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
  static init(){this.all();this.bind();}
  static all(){this.info();this.nftList();}
  static refresh(){this.info();this.nftList();}

  static info(){
    const acc=web3eth.account||"local";
    const a=player.totalAttr(acc);
    $("#atk").text(Math.floor(a.atk));
    $("#def").text(Math.floor(a.def));
    $("#hp").text(Math.floor(a.hp));
    $("#crit").text(Math.floor(a.crit));
    $("#gold").text(economy.gold());
    $("#diamond").text(diamond.get());
  }

  static nftList(){
    const acc=web3eth.account||"local";
    const list=erc721.byOwner(acc);
    const p=player.data();
    $("#nftlist").innerHTML=list.map(n=>`
      <div class="card" style="border-color:${getQualityColor(n.quality)}">
        <h3 style="color:${getQualityColor(n.quality)}">${n.name}+${enhance.level(n.tokenId)}</h3>
        <p>攻${n.atk} 防${n.def} 孔${n.gemSlots}</p>
        <button onclick="game.render.enhance(${n.tokenId},${n.maxEnhance})">强化</button>
        <button onclick="game.render.gem(${n.tokenId})">宝石</button>
        ${p.equip[n.type]==n.tokenId?`<button onclick="game.render.unequip('${n.type}')">卸下</button>`:`<button onclick="game.render.equip(${n.tokenId})">穿戴</button>`}
        <button class="orange" onclick="game.render.sell(${n.tokenId})">摆摊</button>
      </div>
    `).join("")||"<p>去战斗获取装备</p>";
  }

  static combat=debounce(()=>{
    const h=Config.maps.map(m=>`
      <div class="card"><h3>${m.name}</h3><button onclick="game.render.fight(${m.id})">挑战</button></div>
    `).join("");
    $("#main").innerHTML=`
      <div class="page"><div class="title">选择地图</div>
      <button class="back" onclick="game.render.back()">返回</button>
      <div class="grid">${h}</div></div>
    `;
  });

  static fight=debounce((id)=>{
    const r=combat.fight(id);
    alert(`获得：${r.equip.name}`);
    Render.refresh(); Render.back();
  });

  static marketPage=debounce(()=>{
    let h="";
    market.getAllBooths().forEach(b=>{
      b.items.forEach(it=>{
        h+=`<div class="card"><h4>${it.name}</h4><p>${it.price}钻</p><button onclick="game.render.buy(${it.tid})">购买</button></div>`;
      });
    });
    $("#main").innerHTML=`
      <div class="page"><div class="title">集市</div>
      <button class="back" onclick="game.render.back()">返回</button>
      <div class="grid">${h||"<p>暂无商品</p>"}</div></div>
    `;
  });

  static buy=debounce((tid)=>{
    const r=market.buyItem(tid,web3eth.account||"local");
    alert(r.msg); Render.refresh(); Render.marketPage();
  });

  static enhance=debounce((tid,max)=>{
    $("#main").innerHTML=`
      <div class="page"><div class="title">强化</div>
      <button class="back" onclick="game.render.back()">返回</button>
      <div class="panel">
        <p>等级+${enhance.level(tid)}</p>
        <p>强化石：${bag.count("enhance_stone")}</p>
        <button class="btn" onclick="game.render.doEnhance(${tid},${max})">强化</button>
      </div></div>
    `;
  });

  static doEnhance=debounce((tid,max)=>{
    const r=enhance.upgradeByStone(tid,max);
    alert(r.msg); Render.refresh(); Render.back();
  });

  static equip=debounce((tid)=>{
    player.equip(tid); Render.refresh(); Render.back();
  });

  static unequip=debounce((t)=>{
    player.unequip(t); Render.refresh(); Render.back();
  });

  static sell=debounce((tid)=>{
    const p=prompt("售价(钻石):","100");
    if(!p||isNaN(p))return;
    const r=market.onShelf(tid,Number(p),web3eth.account||"local");
    alert(r.msg); Render.refresh();
  });

  static gem=debounce((tid)=>{
    const n=erc721.all().find(x=>x.tokenId==tid);
    const s=gem.slots(tid);
    let h="";
    for(let i=0;i<n.gemSlots;i++){
      const g=s[i]; const name=g?bag.getGem(g)?.name||"宝石":"空";
      h+=`<div class="slot"><p>孔${i+1}：${name}</p>${g?`<button onclick="game.render.take(${tid},${i})">取下</button>`:`<button onclick="game.render.choose(${tid},${i})">镶嵌</button>`}</div>`;
    }
    $("#main").innerHTML=`<div class="page"><div class="title">宝石</div><button class="back" onclick="game.render.back()">返回</button><div class="panel">${h}</div></div>`;
  });

  static choose=debounce((tid,i)=>{
    const list=bag.getAllGems();
    if(!list.length){alert("无宝石");return;}
    const id=prompt("宝石ID：\n"+list.map(g=>g.id).join(","));
    if(!id)return;
    const r=gem.embed(tid,i,id);
    alert(r.msg); Render.refresh(); Render.gem(tid);
  });

  static take=debounce((tid,i)=>{
    const r=gem.take(tid,i);
    alert(r.msg); Render.refresh(); Render.gem(tid);
  });

  static back(){
    $("#main").innerHTML=$("#home_html").innerHTML;
    Render.refresh();
  }

  static bind(){
    $("#connect").onclick=debounce(async()=>{
      await web3eth.connect(); Render.refresh(); alert("连接成功");
    });
    $("#save").onclick=debounce(async()=>{
      const o=prompt("1=导出 2=导入","1");
      o==="1"&&await save.export();
      o==="2"&&$("#fileInput").click();
    });
    $("#fileInput").onchange=(e)=>{
      const r=new FileReader();
      r.onload=async(ev)=>await save.importFromText(ev.target.result);
      r.readAsText(e.target.files[0]);
    };
  }
}

window.$=s=>document.querySelector(s);
