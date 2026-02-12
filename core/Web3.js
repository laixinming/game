export class Web3ETH {
  constructor() {
    this.account = null;
    this.isConnected = false;
  }

  async connect() {
    // 没有钱包不拦截、不崩溃，只返回未连接
    if (!window.ethereum) {
      alert("⚠️ 未检测到钱包，可游客正常游戏，充值/交易需钱包");
      return { success: false };
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      this.account = accounts[0];
      this.isConnected = true;
      alert(`✅ 钱包绑定成功：${this.account}`);
      return { success: true, account: this.account };
    } catch (e) {
      alert("⚠️ 钱包绑定取消，游客模式继续游戏");
      return { success: false };
    }
  }

  async signMessage(msg) {
    if (!this.account) return null;
    try {
      return await window.ethereum.request({
        method: "personal_sign", params: [msg, this.account]
      });
    } catch (e) {
      return null;
    }
  }

  async verify(msg, sig) {
    try {
      return await window.ethereum.request({
        method: "personal_ecRecover", params: [msg, sig]
      });
    } catch (e) {
      return null;
    }
  }
}
export const web3eth = new Web3ETH();
