pragma solidity ^0.4.23;

import "../access/Accessable.sol";


/**
 * @title Eternal storage.
 * @dev The objective of an eternal storage is to keep the data separated from
 * the logic of a smart contract.
 */
contract EternalStorage is Accessable {

  mapping(bytes32 => uint256) _uint;
  mapping(bytes32 => int256) _int;
  mapping(bytes32 => bool) _bool;
  mapping(bytes32 => string) _string;
  mapping(bytes32 => address) _address;
  mapping(bytes32 => bytes32) _bytes;

  // Unsigned integer functions

  /**
   * @dev Gets an unsigned integer value with its key.
   * @param key Key of the value.
   * @return Unsigned integer value.
   */
  function getUint(bytes32 key) public view returns (uint256) {
    return _uint[key];
  }

  /**
   * @dev Sets an unsigned integer value with its key.
   * @param key Key of the value.
   * @param value Unsigned integer value.
   */
  function setUint(bytes32 key, uint256 value) public onlyAuthorized {
    _uint[key] = value;
  }

  /**
   * @dev Deletes an unsigned integer value with its key.
   * @param key Key of the value.
   */
  function deleteUint(bytes32 key) public onlyAuthorized {
    delete _uint[key];
  }

  // Integer functions

  /**
   * @dev Gets an integer value with its key.
   * @param key Key of the value.
   * @return Integer value.
   */
  function getInt(bytes32 key) public view returns (int256) {
    return _int[key];
  }

  /**
   * @dev Sets an integer value with its key.
   * @param key Key of the value.
   * @param value Integer value.
   */
  function setInt(bytes32 key, int256 value) public onlyAuthorized {
    _int[key] = value;
  }

  /**
   * @dev Deletes an integer value with its key.
   * @param key Key of the value.
   */
  function deleteInt(bytes32 key) public onlyAuthorized {
    delete _int[key];
  }

  // Boolean functions

  /**
   * @dev Gets a boolean value with its key.
   * @param key Key of the value.
   * @return Boolean value.
   */
  function getBool(bytes32 key) public view returns (bool) {
    return _bool[key];
  }

  /**
   * @dev Sets a boolean value with its key.
   * @param key Key of the value.
   * @param value Boolean value.
   */
  function setBool(bytes32 key, bool value) public onlyAuthorized {
    _bool[key] = value;
  }

  /**
   * @dev Deletes a boolean value with its key.
   * @param key Key of the value.
   */
  function deleteBool(bytes32 key) public onlyAuthorized {
    delete _bool[key];
  }

  // String functions

  /**
   * @dev Gets a string value with its key.
   * @param key Key of the value.
   * @return String value.
   */
  function getString(bytes32 key) public view returns (string) {
    return _string[key];
  }

  /**
   * @dev Sets a string value with its key.
   * @param key Key of the value.
   * @param value String value.
   */
  function setString(bytes32 key, string value) public onlyAuthorized {
    _string[key] = value;
  }

  /**
   * @dev Deletes a string value with its key.
   * @param key Key of the value.
   */
  function deleteString(bytes32 key) public onlyAuthorized {
    delete _string[key];
  }

  // Address function

  /**
   * @dev Gets an address value with its key.
   * @param key Key of the value.
   * @return Address value.
   */
  function getAddress(bytes32 key) public view returns (address) {
    return _address[key];
  }

  /**
   * @dev Sets an address value with its key.
   * @param key Key of the value.
   * @param value Address value.
   */
  function setAddress(bytes32 key, address value) public onlyAuthorized {
    _address[key] = value;
  }

  /**
   * @dev Deletes an address value with its key.
   * @param key Key of the value.
   */
  function deleteAddress(bytes32 key) public onlyAuthorized {
    delete _address[key];
  }

  // Bytes functions.

  /**
   * @dev Gets bytes value with its key.
   * @param key Key of the value.
   * @return Bytes value.
   */
  function getBytes(bytes32 key) public view returns (bytes32) {
    return _bytes[key];
  }

  /**
   * @dev Sets bytes value with its key.
   * @param key Key of the value.
   * @param value Bytes value.
   */
  function setBytes(bytes32 key, bytes32 value) public onlyAuthorized {
    _bytes[key] = value;
  }

  /**
   * @dev Deletes bytes value with its key.
   * @param key Key of the value.
   */
  function deleteBytes(bytes32 key) public onlyAuthorized {
    delete _bytes[key];
  }
}
