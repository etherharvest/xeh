pragma solidity ^0.4.23;

import "../../contracts/storage/EternalStorage.sol";
import "../../contracts/math/SafeMath.sol";
import "../../contracts/token/ERC20/ERC20Token.sol";


contract Token_V0 is ERC20Token {

  function initialized() public view returns (bool) {
    return _bool[keccak256("token_v0_initialized")];
  }

  function mint(address to, uint256 value) public {
    _uint[keccak256("totalSuply")] = totalSupply().add(value);
    _uint[keccak256("balance", to)] = balanceOf(to).add(value);

    emit Transfer(address(0), to, value);
  }
}
