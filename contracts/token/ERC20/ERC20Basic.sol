pragma solidity ^0.4.23;

import "./IERC20Basic.sol";
import "../../storage/EternalStorage.sol";
import "../../math/SafeMath.sol";


/**
 * @title IERC20Basic implementation.
 * @dev Basic implementation of a ERC20 token with the current architecture.
 */
contract ERC20Basic is IERC20Basic, EternalStorage {
  using SafeMath for uint256;

  /**
   * @dev Event triggered on successful token transfer.
   * @param from Sender address.
   * @param to Receiver address.
   * @param value Amount of tokens sent.
   */
  event Transfer(address indexed from, address indexed to, uint256 value);

  /**
   * @dev Gets the total supply of the token contract.
   * @return Token total supply.
   */
  function totalSupply() public view returns (uint256) {
    return _uint[keccak256("totalSupply")];
  }

  /**
   * @dev Gets the balance of tokens associated to an address.
   * @param who Queried address.
   * @return Balance of tokens of the queried address.
   */
  function balanceOf(address who) public view returns (uint256) {
    return _uint[keccak256("balance", who)];
  }

  /**
   * @dev Transfers tokens from one account (the sender) to another. Emits the
   * event Transfer on success.
   * @param to Destination address.
   * @param value Amount to be transferred.
   * @return True on success, false on failure.
   */
  function transfer(address to, uint256 value) public returns (bool) {
    require(to != address(0));
    require(balanceOf(msg.sender) >= value);

    _uint[keccak256("balance", msg.sender)] = balanceOf(msg.sender).sub(value);
    _uint[keccak256("balance", to)] = balanceOf(to).add(value);

    emit Transfer(msg.sender, to, value);
    return true;
  }
}
