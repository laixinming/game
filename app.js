// 先保证按钮能点！！！
document.addEventListener('DOMContentLoaded', function() {
  console.log('JS 加载成功！');

  // 绑定钱包
  document.getElementById('btn_connect').onclick = function() {
    alert('✅ 绑定钱包按钮点击成功！');
  };

  // 去战斗
  document.getElementById('btn_fight').onclick = function() {
    alert('✅ 去战斗按钮点击成功！');
  };

  // 集市
  document.getElementById('btn_market').onclick = function() {
    alert('✅ 集市按钮点击成功！');
  };

  // 存档
  document.getElementById('btn_save').onclick = function() {
    alert('✅ 存档按钮点击成功！');
  };
});
