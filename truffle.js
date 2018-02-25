const HDWalletProvider = require("truffle-hdwallet-provider");
const secrets = require('./secrets.json');
const mnemonic = secrets.adminMnemonic;

module.exports = {
  networks: {
    test: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 3500000
    },
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 3500000
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
      network_id: 3
    }
  }
};