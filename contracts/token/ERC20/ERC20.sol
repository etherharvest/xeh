pragma solidity ^0.4.23;

import "./IERC20.sol";
import "./ERC20Basic.sol"
import "../../math/SafeMath.sol";


/**
 * @title StandardToken implementation.
 * @dev Basic implementation of a ERC20 token with the current architecture.
 */
contract ERC20 is IERC20, ERC20Basic {
  using SafeMath for uint256;

  /**
   * @dev Event triggered on successful token transfer approval.
   * @param owner Sender address.
   * @param spender Receiver address.
   * @param value Amount of tokens approve.
   */
  event Approval(address indexed owner, address indexed spender, uint256 value);

  /**
   * @dev Gets the allowance between two addresses.
   * @param owner Address of the owner of the tokens.
   * @param spender Address of the receiver.
   * @return The allowance between two addresses.
   */
  function allowance(address owner, address spender)
      public view returns (uint256) {
    return _uint[keccak256("allowance", owner, spender)];
  }

  /**
   * @dev Makes the pre-approved transfer between two addresses. Emits the
   * event Transfer on success.
   * @param from Sender address.
   * @param to Receiver address.
   * @param value Amount to be transferred.
   * @return True on success, false on failure.
   */
  function transferFrom(address from, address to, uint256 value)
      public returns (bool) {
    require(to != address(0));
    require(value <= balanceOf(from));
    require(value <= allowance(from, msg.sender));

    _uint[keccak256("balance", from)] = balanceOf(from).sub(value);
    _uint[keccak256("balance", to)] = balanceOf(to).add(value);
    _uint[keccak256("allowance", from, msg.sender)] =
      allowance(from, msg.sender).sub(value);

    emit Transfer(from, to, value);
    return true;
  }

  /**
   * @dev Approves the transfer of tokens from one address (the sender) to
   * another. Emits the event Approval on success.
   * @param spender Destination address.
   * @param value Amount of tokens to be transferred.
   * @return True on success, false on failure.
   */
  function approve(address spender, uint256 value) public returns (bool) {
    _uint[keccak256("allowance", msg.sender, spender)] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  /**
   * @dev Increases the amount of tokens that an owner allowed to a spender.
   * @param spender Destination address.
   * @param value Amount of tokens to be transferred.
   * @return True on success, false on failure.
   */
  function increaseApproval(address spender, uint256 value)
      public returns (bool) {
    uint256 newValue = (allowance(msg.sender, spender)).add(value);
    _uint[keccak256("allowance", msg.sender, spender)] = newValue;
    emit Approval(msg.sender, spender, newValue);
    return true;
  }

  /**
   * @dev Decreases the amount of tokens that an owner allowed to a spender.
   * @param spender Destination address.
   * @param value Amount of tokens to be transferred.
   * @return True on success, false on failure.
   */
  function decreaseApproval(address spender, uint256 value)
      public returns (bool) {
    uint256 oldValue = allowance(msg.sender, spender);
    uint256 newValue = 0;
    if (value <= oldValue) {
      newValue = (oldValue).sub(value);
    }
    _uint[keccak256("allowance", msg.sender, spender)] = newValue;
    emit Approval(msg.sender, spender, newValue);
    return true;
  }
}
