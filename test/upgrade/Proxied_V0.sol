pragma solidity ^0.4.23;

import "./Proxied.sol";


contract Proxied_V0 is Proxied {
  function setValue(uint _value) public {
    value = _value;
  }

  function getValue() public view returns (uint) {
    return value;
  }
}
