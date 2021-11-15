//window.wallet = async function connect() {
//  const resp = await window.solana.connect();
//  return resp.publicKey.toString();
//}


class ClientWallet {

    constructor() {
        this.address = '';
    }

    async connect() {
        const resp = await window.solana.connect();
        this.address = resp.publicKey.toString();
    }

    address() {
        return this.address;
    }

    async signTransaction() {

    }

    isPhantomInstalled() {
        return window.solana && window.solana.isPhantom;
    }

    disconnect() {
        window.solana.disconnect();
    }
}

var walletModule = { ClientWallet: ClientWallet };


