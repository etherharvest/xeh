pragma solidity ^0.4.23;

import "../../../contracts/ownership/Ownable.sol";
import "../../../contracts/token/ERC223/IERC223Receiver.sol";


contract ERC223TokenReceiver is IERC223Receiver, Ownable {
  mapping(address => bool) token_contracts;

  event TokenTransfer(
    address indexed token_contract,
    address indexed from,
    uint256 value,
    bytes32 data
  );

  function addContract(address token_contract) public onlyOwner {
    token_contracts[token_contract] = true;
  }

  function deleteContract(address token_contract) public onlyOwner {
    delete token_contracts[token_contract];
  }

  function tokenFallback(
    address from,
    uint256 value,
    bytes32 data
  ) public returns (bool) {
    require(token_contracts[msg.sender]);

    emit TokenTransfer(msg.sender, from, value, data);

    return true;
  }
}
