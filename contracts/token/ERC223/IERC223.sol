pragma solidity ^0.4.23;

import "../ERC20/IERC20Basic.sol";


/**
 * @title ERC223 basic interface
 * @dev see https://github.com/ethereum/EIPs/issues/223
 */
contract IERC223 is IERC20Basic {
  function transfer(address to, uint256 value, bytes32 data)
    public returns (bool);

  event Transfer(
    address indexed from,
    address indexed to,
    uint256 value,
    bytes32 indexed data
  );
}
