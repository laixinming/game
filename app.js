// ==============================================
// 暗黑割草战神 - 完整稳定版（无模块、按钮必响应）
// ==============================================
const GAME_VERSION = "9.0";

// 工具
function $(id) { return document.getElementById(id); }
function uuid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// 本地存储
const storage = {
  set(key, val) { localStorage.setItem("darkwar_" + key, JSON.stringify(val)); },
  get(key) {
    const v = localStorage.getItem("darkwar_" + key);
    return v ? JSON.parse(v) : null;
  }
};

// 初始数据
if (!storage.get("player")) storage.set("player", { equip: {} });
if (storage.get("gold") == null) storage.set("gold", 1000);
if (storage.get("diamond") == null) storage.set("diamond", 100);
if (!storage.get("nfts")) storage.set("nfts", []);
if (!storage.get("bag")) storage.set("bag", {});

// 装备配置
const equipments = [
  { id: "weapon_001", name: "炎魔之刃", type: "武器", atk: 120, def: 20, hp: 0, gemSlots: 2 },
  { id: "armor_001", name: "黑龙铠甲", type: "防具", atk: 30, def: 150, hp: 200 },
  { id: "artifact_001", name: "创世神石", type: "神器", atk: 300, def: 200, hp: 500 }
];

// 战斗爆装备
function fightDrop() {
  const eq = equipments[Math.floor(Math.random() * equipments.length)];
  const tokenId = uuid();
  const nfts = storage.get("nfts");
  nfts.push({ ...eq, tokenId });
  storage.set("nfts", nfts);
  return eq;
}

// 刷新界面属性
function refreshPanel() {
  const p = storage.get("player");
  const nfts = storage.get("nfts") || [];
  let atk = 150, def = 80, hp = 1500;

  nfts.forEach(n => {
    if (p.equip[n.type] === n.tokenId) {
      atk += n.atk;
      def += n.def;
      hp += n.hp;
    }
  });

  $("atk").innerText = atk;
  $("def").innerText = def;
  $("hp").innerText = hp;
  $("gold").innerText = storage.get("gold");
  $("diamond").innerText = storage.get("diamond");

  // 刷新装备列表
  const list = nfts.map(n => `
    <div style='background:#121225;padding:14px;margin:8px;border-radius:10px;border:2px solid #445'>
      <div style='color:#00f0ff;font-weight:bold'>${n.name}</div>
      <div style='font-size:12px;margin:4px 0'>攻${n.atk} 防${n.def}</div>
      <button onclick='equip("${n.tokenId}","${n.type}")'
        style='padding:6px 10px;background:#223;color:#00f0ff;border:1px solid #00f0ff;border-radius:6px'>
        穿戴
      </button>
    </div>
  `).join("") || "<div style='color:#888'>点击【去战斗】获取装备</div>";

  document.getElementById("nftlist").innerHTML = list;
}

// 穿戴装备
window.equip = function equip(tid, type) {
  const p = storage.get("player");
  p.equip = {};
  p.equip[type] = tid;
  storage.set("player", p);
  refreshPanel();
};

// 按钮功能
document.addEventListener('DOMContentLoaded', function() {
  refreshPanel();

  // 绑定钱包
  $("btn_connect").onclick = () => {
    alert("🔗 绑定钱包仅用于充值/交易，不影响游戏");
  };

  // 去战斗
  $("btn_fight").onclick = () => {
    const eq = fightDrop();
    alert(`✅ 战斗胜利！获得：${eq.name}`);
    refreshPanel();
  };

  // 集市
  $("btn_market").onclick = () => {
    alert("🛒 集市功能已解锁（玩家交易）");
  };

  // 存档
  $("btn_save").onclick = () => {
    const data = JSON.stringify({
      player: storage.get("player"),
      gold: storage.get("gold"),
      diamond: storage.get("diamond"),
      nfts: storage.get("nfts"),
      bag: storage.get("bag")
    });
    const blob = new Blob([data], { type: "text/plain" });
    const a = document.createElement("a");
    a.download = "暗黑战神存档.txt";
    a.href = URL.createObjectURL(blob);
    a.click();
    alert("💾 存档导出成功！");
  };
});
