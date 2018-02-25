const EMRouter = artifacts.require('../contracts/EMRouter.sol');

const DENIED_SIG = web3.sha3('Denied(address)');

function assertDenied(tx) {
    return assert.equal(tx.logs[0].event, 'Denied');
}

contract('EMRouter', (accts) => {
    const admin = accts[0];
    const mary = accts[1];
    const jack = accts[2];
    let router;

    const asset1 = {
        name: 'Name1',
        hash: '0x0f685af72e82ed860efcd7bbb5cffcb0285476933b95d185a48379daeec8f651'
    };
    const asset2 = {
        name: 'name2',
        hash: '0xce7b024d7f92455613c1b38aa3e7149560146fe0cfbd01846f49a418383c11ae'
    };

    const addr1 = {
        name: 'name1',
        abi: '0xcd157b268d290333085e7d577775df7baed7acb53f1e6b2f8f48578b02a39a21',
        address: '0xe8ea27ce57f5286ef1ee867feb056b69c62cd369'
    }
    const addr2 = {
        name: 'name2',
        abi: '0x7f2624eb0bedf0edbbd31985f0f8a07d3473c8a463dd9ba201fa2988fed2ee35',
        address: '0xe8ea27ce57f5286ef1ee867feb056b69c62cd360'
    }

    it("should allow the setting of an asset", () => {
        return EMRouter.deployed().then((instance) => {
            router = instance;
            return router.setAsset(asset1.name, asset1.hash, { from: admin });
        }).then((txHash) => {
            return router.getAsset(asset1.name);
        }).then((hash) => {
            assert.equal(hash, asset1.hash);
        });
    });

    it("should allow the setting of an address", () => {
        return EMRouter.deployed().then((instance) => {
            router = instance;
            return router.setAddress(addr1.name, addr1.abi, addr1.address, { from: admin });
        }).then((txHash) => {
            return router.getAddress(addr1.name);
        }).then((result) => {
            const abi = result[0];
            const address = result[1];
            
            assert.equal(abi, addr1.abi);
            assert.equal(address, addr1.address);
        });
    });

    it("should not allow randos to set an asset", () => {
        return EMRouter.deployed().then((instance) => {
            router = instance;
            return router.setAsset(asset1.name, asset2.hash, { from: mary });
        }).then((tx) => {
            assertDenied(tx);
            return router.getAsset(asset1.name);
        }).then((result) => {
            assert.equal(result, asset1.hash);
        });
    });

    it("should not allow randos to set an address", () => {
        return EMRouter.deployed().then((instance) => {
            router = instance;
            return router.setAddress(addr1.name, addr2.abi, addr2.address, { from: mary });
        }).then((tx) => {
            assertDenied(tx);
            return router.getAddress(addr1.name);
        }).then((result) => {
            const abi = result[0];
            const address = result[1];
            
            assert.equal(abi, addr1.abi);
            assert.equal(address, addr1.address);
        });
    });

});