pragma solidity ^0.4.23;

import "../../../contracts/token/ERC20/ERC20Basic.sol";


contract ERC20BasicToken is ERC20Basic {

  function initialize(uint256 _totalSupply) public onlyOwner {
    require(_uint[keccak256("totalSupply")] == 0);

    _uint[keccak256("totalSupply")] = _totalSupply;
    _uint[keccak256("balance", msg.sender)] = _totalSupply;
  }
}
