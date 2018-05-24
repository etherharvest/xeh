pragma solidity ^0.4.23;

import "./ProxiedStorage.sol";


contract Proxied is ProxiedStorage {
  function getValue() public view returns (uint);
  function setValue(uint _value) public;
}
