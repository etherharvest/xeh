pragma solidity ^0.4.23;

import "./IERC223.sol";
import "./IERC223Receiver.sol";
import "../ERC20/ERC20Basic.sol";
import "../../math/SafeMath.sol";


/**
 * @title ERC223 basic implementation.
 * @dev Basic implementation of a ERC223 token backwards compatible with ERC20
 * and using the current architecture.
 */
contract ERC223 is IERC223, ERC20Basic {
  using SafeMath for uint256;

  /**
   * @dev Event triggered on successful token transfer.
   * @param from Sender address.
   * @param to Receiver address.
   * @param value Amount of tokens sent.
   * @param data Data of the transaction.
   */
  event Transfer(
    address indexed from,
    address indexed to,
    uint256 value,
    bytes32 indexed data
  );

  /**
   * @dev ERC20 transfer function adapted for ERC223.
   * @param to Receiver address.
   * @param value Amount of tokens to be sent.
   * @return Whether the transfer was successful or not.
   */
  function transfer(address to, uint256 value) public returns (bool) {
    bytes32 empty;
    return transfer(to, value, empty);
  }

  /**
   * @dev ERC223 transfer function. Emits 2 events (ERC20 Transfer event and
   * ERC223 transfer event) on success for normal addresses and one event
   * (ERC223 Transfer event) for contracts.
   * @param to Destination address.
   * @param value Amount to be transferred.
   * @param data Data of the transfer.
   * @return True on success, false on failure.
   */
  function transfer(address to, uint256 value, bytes32 data)
      public returns (bool) {
    if(!super.transfer(to, value)) {
      revert();
    }

    if (isContract(to)) {
      return contractFallback(msg.sender, to, value, data);
    }

    emit Transfer(msg.sender, to, value, data);
    return true;
  }

  /**
   * @dev Transfer function for contract addresses.
   * @param to Destination address.
   * @param value Amount to be transferred.
   * @param data Data of the transfer.
   * @return True on success, false on failure.
   */
  function contractFallback(
    address from,
    address to,
    uint256 value,
    bytes32 data
  ) private returns (bool) {
    IERC223Receiver receiver = IERC223Receiver(to);
    return receiver.tokenFallback(msg.sender, from, value, data); // TODO: Fix me
  }

  /**
   * @dev Checks whether the address is a contract or not.
   * @param addr Address.
   * @return Whether the address is a contract or not.
   */
  function isContract(address addr) private view returns (bool) {
    uint256 length;
    assembly {
      length := extcodesize(addr)
    }
    return (length > 0);
  }
}
