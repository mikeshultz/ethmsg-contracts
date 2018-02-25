const ipfsAPI = require('ipfs-api');
const multihashes = require('multihashes');
const EMRouter = artifacts.require("./contracts/EMRouter.sol");
const MessageStore = artifacts.require("./contracts/MessageStore.sol");

module.exports = function(deployer, network, accounts) {
  const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' });

  deployer.deploy(MessageStore).then(() => {
    console.log(`MessageStore: ${MessageStore.address}`);
    return deployer.deploy(EMRouter).then(() => {
      console.log(`EMRouter: ${EMRouter.address}`);

      const ABIBuffer = new Buffer(JSON.stringify(MessageStore.abi));

      return ipfs.files.add(ABIBuffer).then((ipfsReturn) => {
        const abiHash = ipfsReturn[0].hash;
        const router = EMRouter.at(EMRouter.address);
        const hexHash = '0x' + multihashes.toHexString(multihashes.fromB58String(abiHash)).slice(4);
        return router.setAddress('messagestore', hexHash, MessageStore.address, { from: accounts[0], gas: 6000000 }).then(() => {
          console.log("messagestore set in EMRouter");
        });
      });
    });
  });

};
