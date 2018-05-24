pragma solidity ^0.4.23;

/**
 * 
 */
contract IERC223Receiver {
  function tokenFallback(
    address sender,
    address origin,
    uint256 value,
    bytes32 data
  ) public returns (bool);
}
