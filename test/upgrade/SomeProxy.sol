pragma solidity ^0.4.23;

import "../../contracts/upgrade/Proxy.sol";


contract SomeProxy is Proxy {
  uint internal value;
  address internal _implementation;

  function implementation() public view returns (address) {
    return _implementation;
  }

  function setImplementation(address impl) public {
    _implementation = impl;
  }
}
