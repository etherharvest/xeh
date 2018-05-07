pragma solidity ^0.4.23;

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
   * Values can be `bool`, `int`, `uint`, `string`, `address` or `bytes32`.
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

  // Boolean methods

  /**
   * @param _key Key of the value.
   *
   * @return Whether there is a boolean stored for the key or not.
   */
  function hasBool(bytes32 _key) external view returns (bool) {
    return store._bool[_key].isSet;
  }

  /**
   * @dev Gets a boolean from the storage with its key. Throws if the key
   * doesn't exist.
   * @param _key Key of the value.
   *
   * @return Boolean value.
   */
  function getBool(bytes32 _key) external view returns (bool) {
    require(store._bool[_key].isSet);

    return store._bool[_key].value;
  }

  /**
   * @param _key   Key of the value.
   * @param _value Boolean value.
   */
  function setBool(bytes32 _key, bool _value) external onlyAuthorized {
    store._bool[_key].isSet = true;
    store._bool[_key].value = _value;
  }

  /**
   * @param _key Key of the value.
   */
  function deleteBool(bytes32 _key) external onlyAuthorized {
    delete store._bool[_key];
  }

  // Integer methods

  /**
   * @param _key Key of the value.
   *
   * @return Whether there is an integer stored for the key or not.
   */
  function hasInt(bytes32 _key) external view returns (bool) {
    return store._int[_key].isSet;
  }

  /**
   * @dev Gets an integer from the storage with its key. Throws if the key
   * doesn't exist.
   * @param _key Key of the value.
   *
   * @return Integer value.
   */
  function getInt(bytes32 _key) external view returns (int) {
    require(store._int[_key].isSet);

    return store._int[_key].value;
  }

  /**
   * @param _key   Key of the value.
   * @param _value Integer value.
   */
  function setInt(bytes32 _key, int _value) external onlyAuthorized {
    store._int[_key].isSet = true;
    store._int[_key].value = _value;
  }

  /**
   * @param _key Key of the value.
   */
  function deleteInt(bytes32 _key) external onlyAuthorized {
    delete store._int[_key];
  }

  // Unsigned integer methods

  /**
   * @param _key Key of the value.
   *
   * @return Whether there is an unsigned integer stored for the key or not.
   */
  function hasUint(bytes32 _key) external view returns (bool) {
    return store._uint[_key].isSet;
  }

  /**
   * @dev Gets an unsigned integer from the storage with its key. Throws if the
   * key doesn't exist.
   * @param _key Key of the value.
   *
   * @return Unsigned integer value.
   */
  function getUint(bytes32 _key) external view returns (uint) {
    require(store._uint[_key].isSet);

    return store._uint[_key].value;
  }

  /**
   * @param _key   Key of the value.
   * @param _value Unsigned integer value.
   */
  function setUint(bytes32 _key, uint _value) external onlyAuthorized {
    store._uint[_key].isSet = true;
    store._uint[_key].value = _value;
  }

  /**
   * @param _key Key of the value.
   */
  function deleteUint(bytes32 _key) external onlyAuthorized {
    delete store._uint[_key];
  }

  // String methods

  /**
   * @param _key Key of the value.
   *
   * @return Whether there is a string stored for the key or not.
   */
  function hasString(bytes32 _key) external view returns (bool) {
    return store._string[_key].isSet;
  }

  /**
   * @dev Gets a string from the storage with its key. Throws if the key
   * doesn't exist.
   * @param _key Key of the value.
   *
   * @return String value.
   */
  function getString(bytes32 _key) external view returns (string) {
    require(store._string[_key].isSet);

    return store._string[_key].value;
  }

  /**
   * @param _key   Key of the value.
   * @param _value String value.
   */
  function setString(bytes32 _key, string _value) external onlyAuthorized {
    store._string[_key].isSet = true;
    store._string[_key].value = _value;
  }

  /**
   * @param _key Key of the value.
   */
  function deleteString(bytes32 _key) external onlyAuthorized {
    delete store._string[_key];
  }

  // Address methods

  /**
   * @param _key Key of the value.
   *
   * @return Whether there is an address stored for the key or not.
   */
  function hasAddress(bytes32 _key) external view returns (bool) {
    return store._address[_key].isSet;
  }

  /**
   * @dev Gets an address from the storage with its key. Throws if the key
   * doesn't exist.
   * @param _key Key of the value.
   *
   * @return Address value.
   */
  function getAddress(bytes32 _key) external view returns (address) {
    require(store._address[_key].isSet);

    return store._address[_key].value;
  }

  /**
   * @param _key   Key of the value.
   * @param _value Address value.
   */
  function setAddress(bytes32 _key, address _value) external onlyAuthorized {
    store._address[_key].isSet = true;
    store._address[_key].value = _value;
  }

  /**
   * @param _key Key of the value.
   */
  function deleteAddress(bytes32 _key) external onlyAuthorized {
    delete store._address[_key];
  }

  // Bytes methods

  /**
   * @param _key Key of the value.
   *
   * @return Whether there is a bytes stored for the key or not.
   */
  function hasBytes(bytes32 _key) external view returns (bool) {
    return store._bytes[_key].isSet;
  }

  /**
   * @dev Gets a bytes from the storage with its key. Throws if the key
   * doesn't exist.
   * @param _key Key of the value.
   *
   * @return Bytes value.
   */
  function getBytes(bytes32 _key) external view returns (bytes) {
    require(store._bytes[_key].isSet);

    return store._bytes[_key].value;
  }

  /**
   * @param _key   Key of the value.
   * @param _value Bytes value.
   */
  function setBytes(bytes32 _key, bytes _value) external onlyAuthorized {
    store._bytes[_key].isSet = true;
    store._bytes[_key].value = _value;
  }

  /**
   * @param _key Key of the value.
   */
  function deleteBytes(bytes32 _key) external onlyAuthorized {
    delete store._bytes[_key];
  }
}
