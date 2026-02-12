export class Web3ETH {
  constructor() { this.account = null; this.isConnected = false; }
  async connect() {
    if (!window.ethereum) { alert("请安装MetaMask"); return {success:false}; }
    try {
      const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
      this.account = accounts[0]; this.isConnected = true;
      return {success:true, account:this.account};
    } catch(e) { return {success:false}; }
  }
  async signMessage(msg) {
    if (!this.account) await this.connect();
    try {
      return await window.ethereum.request({method:"personal_sign", params:[msg, this.account]});
    } catch(e) { return null; }
  }
  async verify(msg, sig) {
    try {
      return await window.ethereum.request({method:"personal_ecRecover", params:[msg, sig]});
    } catch(e) { return null; }
  }
}
export const web3eth = new Web3ETH();
