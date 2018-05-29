pragma solidity ^0.4.23;

/**
 * @title ERC223 receiver.
 * @dev Basic implementation of a ERC223 token receiver.
 */
contract IERC223Receiver {
  function tokenFallback(
    address from,
    uint256 value,
    bytes32 data
  ) public returns (bool);
}
