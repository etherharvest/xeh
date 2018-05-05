pragma solidity ^0.4.17;

import "./access/Accessable.sol";


/**
 * @title Ether Harvest eternal storage.
 * @author Alexander de Sousa.
 * @dev The objective of an eternal storage is to keep the data separated from
 * the logic of a smart contract.
 *
 * This contract is meant to be deployed once and then all the contracts will
 * use the provided structures to store their data.
 *
 * The code of the smart contracts that use this storage can be updated in
 * order to fix bugs and introduce new features to them without compromising
 * the data.
 */
contract EtherHarvestStorage is Accessable {
  /**
   * @struct Boxed boolean.
   * @dev Boxed booleans to protect from unitialized values.
   */
  struct Bool {
    bool isSet;
    bool value;
  }

  /**
   * @struct Boxed integers.
   * @dev Boxed integers to protect from unitialized values.
   */
  struct Int {
    bool isSet;
    int value;
  }

  /**
   * @struct Boxed unsigned integers.
   * @dev Boxed unsigned integers to protect from unitialized values.
   */
  struct Uint {
    bool isSet;
    uint value;
  }

  /**
   * @struct Boxed strings.
   * @dev Boxed strings to protect from unitialized values.
   */
  struct String {
    bool isSet;
    string value;
  }

  /**
   * @struct Boxed address.
   * @dev Boxed addresses to protect from unitialized values.
   */
  struct Address {
    bool isSet;
    address value;
  }

  /**
   * @struct Boxed bytes.
   * @dev Boxed bytes to protect from unitialized values.
   */
  struct Bytes {
    bool isSet;
    bytes value;
  }

  /**
   * @struct Basic storage unit.
   * @dev Storage struct. Every field is a map that goes from a key to a value.
   * Values can be `bool`, `int`, `uint`, `string`, `address` or `bytes`.
   */
  struct Storage {
    mapping(bytes32 => Bool) _bool;
    mapping(bytes32 => Int) _int;
    mapping(bytes32 => Uint) _uint;
    mapping(bytes32 => String) _string;
    mapping(bytes32 => Address) _address;
    mapping(bytes32 => Bytes) _bytes;
  }

  /**
   * Storage for variables.
   */
  Storage internal store;

  /**
   * Access list.
   */
  mapping(address => bool) internal acl;

  // Constructor

  /**
   * @dev Eternal storage contructor.
   */
  function EtherHarvestStorage() public {}

  // Get methods

  /**
   * @param _key Key of the storage.
   *
   * @return Boolean value.
   */
  function getBool(bytes32 _key) external view returns (bool) {
    require(store._bool[_key].isSet);

    return store._bool[_key].value;
  }

  // Set methods

  /**
   * @param _key   Key of the value.
   * @param _value Boolean value.
   */
  function setBool(bytes32 _key, bool _value) external onlyAuthorized {
    store._bool[_key].isSet = true;
    store._bool[_key].value = _value;
  }

  // Delete methods

  /**
   * @param _key Key of the value.
   */
  function deleteBool(bytes32 _key) external onlyAuthorized {
    delete store._bool[_key];
  }
}
