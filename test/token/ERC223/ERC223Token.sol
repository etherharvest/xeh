pragma solidity ^0.4.23;

import "../../../contracts/token/ERC223/ERC223.sol";
import "../ERC20/ERC20BasicToken.sol";


contract ERC223Token is ERC223, ERC20BasicToken {
  function initialize(uint256 _totalSupply) public onlyOwner {
    require(_uint[keccak256("totalSupply")] == 0);

    _uint[keccak256("totalSupply")] = _totalSupply;
    _uint[keccak256("balance", msg.sender)] = _totalSupply;
  }
}
