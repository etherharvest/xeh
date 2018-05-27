pragma solidity ^0.4.23;

import "../../../contracts/token/ERC20/ERC20.sol";


contract StandardToken is ERC20 {
  function initialize(uint256 _totalSupply) public onlyOwner {
    require(!initialized());

    _bool[keccak256("standard_token_initialized")] = true;
    _uint[keccak256("totalSupply")] = _totalSupply;
    _uint[keccak256("balance", msg.sender)] = _totalSupply;
  }

  function initialized() public view returns (bool) {
    return _bool[keccak256("standard_token_initialized")];
  }
}
