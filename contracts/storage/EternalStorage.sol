pragma solidity ^0.4.23;


/**
 * @title Eternal storage.
 * @dev The objective of an eternal storage is to keep the data separated from
 * the logic of a smart contract.
 */
contract EternalStorage {
  mapping(bytes32 => bool) _bool;
  mapping(bytes32 => int256) _int;
  mapping(bytes32 => uint256) _uint;
  mapping(bytes32 => string) _string;
  mapping(bytes32 => address) _address;
  mapping(bytes32 => bytes) _bytes;
}
