pragma solidity ^0.4.23;

import "../storage/EternalStorage.sol";
import "../upgrade/UpgradeabilityProxy.sol";


/**
 * @title EternalStorageProxy
 * @dev General eternal storage proxy. Every instance of this contract grants
 * upgradeability to the contracts reached through it.
 */
contract EternalStorageProxy is EternalStorage, UpgradeabilityProxy {}
