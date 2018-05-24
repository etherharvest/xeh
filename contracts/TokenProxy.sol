pragma solidity ^0.4.23;

import "./storage/EternalStorage.sol";
import "./upgrade/UpgradeabilityProxy.sol";


/**
 * @title TokenProxy
 * @dev General eternal storage and proxy for token contracts.
 */
contract TokenProxy is EternalStorage, UpgradeabilityProxy {}
