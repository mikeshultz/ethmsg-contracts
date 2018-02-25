const MessageStore = artifacts.require('../contracts/MessageStore.sol');

function assertDenied(tx) {
    return assert.equal(tx.logs[0].event, 'Denied');
}

contract('MessageStore', (accts) => {
    const admin = accts[0];
    const mary = accts[1];
    const jack = accts[2];
    let store;

    const message1 = {
        decryptionKey: '0xce7b024d7f92455613c1b38aa3e7149560146fe0cfbd01846f49a418383c11ae',
        signature: '0xcd157b268d290333085e7d577775df7baed7acb53f1e6b2f8f48578b02a39a21',
        contentHash: '0x0f685af72e82ed860efcd7bbb5cffcb0285476933b95d185a48379daeec8f651'
    };

    it("should allow the addition of a message", () => {
        return MessageStore.deployed().then((instance) => {
            store = instance;
            return store.add(message1.decryptionKey, message1.signature, message1.contentHash, { from: admin });
        }).then((txHash) => {
            return store.get(admin, 0);
        }).then((result) => {
            const created = result[0];
            const key = result[1];
            const sig = result[2];
            const content = result[3];
            
            assert.equal(key, message1.decryptionKey);
            assert.equal(sig, message1.signature);
            assert.equal(content, message1.contentHash);
        });
    });
});