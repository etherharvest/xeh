pragma solidity ^0.4.23;

import "../../contracts/upgrade/UpgradeabilityProxy.sol";
import "./ProxiedStorage.sol";


contract SomeUpgradeabilityProxy is ProxiedStorage, UpgradeabilityProxy {}
