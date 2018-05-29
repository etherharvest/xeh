pragma solidity ^0.4.23;

import "../../../contracts/token/ERC20/ERC20.sol";


contract ERC20Token is ERC20 {
  function initialize(uint256 _totalSupply) public onlyOwner {
    require(_uint[keccak256("totalSupply")] == 0);

    _uint[keccak256("totalSupply")] = _totalSupply;
    _uint[keccak256("balance", msg.sender)] = _totalSupply;
  }
}
