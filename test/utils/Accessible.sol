pragma solidity ^0.4.23;

import "../../contracts/access/Accessable.sol";


contract Accessible is Accessable {
  int internal value = 42;

  function getAuthorizedValue() external onlyAuthorized view returns (int) {
    return value;
  }
}
