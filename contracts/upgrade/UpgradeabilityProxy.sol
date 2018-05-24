pragma solidity ^0.4.23;

import "../upgrade/Proxy.sol";
import "../upgrade/UpgradeabilityStorage.sol";


/**
 * @title UpgradeabilityProxy
 * @dev This contract represents a proxy where the implementation address to
 * which it will delegate can be upgrades.
 */
contract UpgradeabilityProxy is Proxy, UpgradeabilityStorage {}
