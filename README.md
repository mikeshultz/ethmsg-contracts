# Ethmsg Contracts

These are the contracts for ethmsg.

## Contracts

### EMRouter

EMRouter is the primary routing contract.  It's where the dapp will find the 
other contracts and assets it needs.  For instance, if it needs to know where 
the live MessageStore contract is, it'll ask EMRouter.  If it needs to know 
where a JavaScript file is on IPFS, it'll ask EMRouter.

#### Public Views

##### getAsset(string name)

`getAsset()` will return a hex-encoded IPFS hash for an asset.

##### getAddress(string name)

`getAddress()` will return an IPFS hash for an ABI(if applicable) and an address
where a contract might be found.

For instance, to get the location for MessageStore, you might call it like this:

    const results = router.getAddress('messagestore');
    const abiHash = results[0];
    const address = results[1];

### MessageStore

MessageStore is the primary persistence contract for EthMsg.  It stores pretty
much all state necessary for the dapp.

#### Public Views

##### get(address user)

`get()` will provide information on the latest message from a user.  It provides
the block number when it was `created`, the `decryptionKey` used to decrypt the
message(if applicable) and the IPFS `contenHash` of the method.

##### get(address user, uint index)

This version of `get()` will will provide information on the a message at a 
specific index for a user.  It provides the block number when it was `created`, 
the `decryptionKey` used to decrypt the message(if applicable) and the IPFS 
`contenHash` of the method.

##### getLength(address user)

`getLength()` will return the total number of messages stored by a user.

##### add(bytes32 decryptionKey, bytes32 contenHash)

`add()` is used to save a message to Ethmsg.  Only `contentHash` is required.

## Test

Make sure you have ganache-cli running as a test network.
    ganache-cli -a10

Then just run the truffle/mocha test suite.

    truffle test