pragma solidity ^0.4.19;

contract EMRouter {

    struct AddressRecord {
        bytes32 abiHash;
        address targetAddress;
    }

    event NewAsset(string name, bytes32 ipfsHash);
    event NewAddress(string name, bytes32 abiHash, address targetAddress);
    event Denied(address sender);

    modifier adminOnly() {
        if (msg.sender != admin) {
            Denied(msg.sender);
        } else {
            _;
        }
    }

    address public admin;
    address public next;
    mapping (string => bytes32) internal assets;
    mapping (string => AddressRecord) internal addresses;
    
    function EMRouter() public {
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
     * @dev setNext sets the next contract in the chain of router contracts. 
     *      next is used to reference the next contract in the upgrade chain. 
     *      So, version 2 of this contract might be a complete rewrite for 
     *      whatever reason, so clients will be made to always check next
     * @param _next is the address for the next contract
     */
    function setNext(address _next) adminOnly public {
        next = _next;
    }

    /**
     * @dev setAsset is used to set the IPFS asset hash by name
     * @param name is the string ID of the asset
     * @param ipfsHash is the Qm hash for the IPFS asset
     */
    function setAsset(string name, bytes32 ipfsHash) adminOnly public {
        assets[name] = ipfsHash;
        NewAsset(name, ipfsHash);
    }

    /**
     * @dev getAsset returns an IPFS asset hash by name
     * @param name is the string ID of the asset
     * @return ipfsHash is the Qm hash for the IPFS asset
     */
    function getAsset(string name) public view returns (bytes32) {
        return assets[name];
    }

    /**
     * @dev setContract is used to set an address by name
     * @param name is the string ID of the address
     * @param addr is the Qm hash for the IPFS asset
     */
    function setAddress(string name, bytes32 abi, address addr) adminOnly public {
        addresses[name] = AddressRecord(abi, addr);
        NewAddress(name, abi, addr);
    }

    /**
     * @dev getAddress returns an address by name
     * @param name is the string ID of the address
     * @return address
     */
    function getAddress(string name) public view returns (bytes32, address) {
        return (addresses[name].abiHash, addresses[name].targetAddress);
    }

    /**
     * @dev catch-all that does nothing but revert
     */
    function () public {
        revert();
    }

}