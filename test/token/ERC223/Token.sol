pragma solidity ^0.4.23;

import "../../../contracts/token/ERC223/ERC223.sol";


contract Token is ERC223 {

  function name() public pure returns (string) {
    return "Test Token";
  }

  function symbol() public pure returns (string) {
    return "TTK";
  }

  function decimals() public pure returns (uint8) {
    return 18;
  }

  function initialize(uint256 _totalSupply) public onlyOwner {
    require(!initialized());

    _bool[keccak256("basic_token_initialized")] = true;
    _uint[keccak256("totalSupply")] = _totalSupply;
    _uint[keccak256("balance", msg.sender)] = _totalSupply;
  }

  function initialized() public view returns (bool) {
    return _bool[keccak256("basic_token_initialized")];
  }
}
