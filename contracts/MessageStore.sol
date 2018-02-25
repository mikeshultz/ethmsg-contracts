pragma solidity ^0.4.19;

contract MessageStore {

    struct Message {
        uint created;
        bytes32 decryptionKey;
        bytes32 signature;
        bytes32 contenHash;
    }

    event MessageAdded(bytes32 decryptionKey, bytes32 signature, bytes32 ipfsHash);
    event Denied(address sender);

    modifier adminOnly() {
        if (msg.sender != admin) {
            Denied(msg.sender);
        } else {
            _;
        }
    }

    address public admin;
    mapping (address => Message[]) public messages;
    
    /**
     * @dev Constructor only sets admin
     */
    function MessageStore() public {
        if (admin == address(0)) {
            admin = msg.sender;
        }
    }

    /**
     * @dev setAdmin sets the admin address
     * @param _admin is the address allowed to manipulate the contract
     */
    function setAdmin(address _admin) adminOnly public {
        admin = _admin;
    }

    /**
     * @dev get returns the latest message for a user
     * @param _user is the address to pull from
     * @return uint is the block number when the message was created
     * @return bytes32 is the decryption key(if any)
     * @return bytes32 is the signature of the message
     * @return bytes32 is the IPFS hash of the message
     */
    function get(address _user) public view returns (uint, bytes32, bytes32, bytes32) {
        return (
            messages[_user][messages[_user].length].created,
            messages[_user][messages[_user].length].decryptionKey,
            messages[_user][messages[_user].length].signature,
            messages[_user][messages[_user].length].contenHash
        );
    }

    /**
     * @dev get returns a message for a user at a specific index
     * @param _user is the address to pull
     * @param _idx the message index to pull
     * @return uint is the block number when the message was created
     * @return bytes32 is the decryption key(if any)
     * @return bytes32 is the signature of the message
     * @return bytes32 is the IPFS hash of the message
     */
    function get(address _user, uint _idx) public view returns (uint, bytes32, bytes32, bytes32) {
        return (
            messages[_user][_idx].created,
            messages[_user][_idx].decryptionKey,
            messages[_user][_idx].signature,
            messages[_user][_idx].contenHash
        );
    }

    /**
     * @dev getLength returns the total messages for a user
     * @param _user is the address to pull
     * @return uint the count of messages
     */
    function getLength(address _user) public view returns (uint) {
        return messages[_user].length;
    }

    /**
     * @dev getLength returns the total messages for a user
     * @param _decryptionKey is the sym encryption key
     * @param _signature is signature of the message after it was signed
     * @param _contenHash is the IPFS hash of the stored message
     */
    function add(bytes32 _decryptionKey, bytes32 _signature, bytes32 _contenHash) public {
        if (_contenHash == bytes32(0)) {
            revert();
        }
        messages[msg.sender].push(Message(
            block.number,
            _decryptionKey,
            _signature,
            _contenHash
        ));
        MessageAdded(_decryptionKey, _signature, _contenHash);
    }

    /**
     * @dev catch-all that does nothing but revert
     */
    function () public {
        revert();
    }
}