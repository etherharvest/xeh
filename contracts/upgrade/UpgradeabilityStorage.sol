pragma solidity ^0.4.23;

import "../ownership/Ownable.sol";


/**
 * @title UpgradeabilityStorage
 * @dev This contract represents a storage for the upgrade information.
 */
contract UpgradeabilityStorage is Ownable {
  // Version name of the current implementation.
  string internal _version;

  // Address of the current implementation.
  address internal _implementation;

  /**
   * @dev This event will be emitted every time the implementation gets
   * upgraded.
   * @param version Representing the version name of the upgraded
   * implementation.
   * @param implementation Representing the address of the upgraded
   * implementation.
   */
  event Upgraded(string version, address indexed implementation);

  /**
   * @dev Returns the version name of the current implementation.
   * @return String representing the name of the current version.
   */
  function version() public view returns (string) {
    return _version;
  }

  /**
   * @dev Returns the address of the current implementation.
   * @return Address of the current implementation.
   */
  function implementation() public view returns (address) {
    return _implementation;
  }

  /**
   * @dev Upgrades the implementation address.
   * @param ver Representing the version name of the upgraded implementation.
   * @param impl Representing the address of the upgraded implementation.
   */
  function upgradeTo(string ver, address impl) public onlyOwner {
    require(address(0) != impl);
    require(_implementation != impl);
    _version = ver;
    _implementation = impl;
    emit Upgraded(ver, impl);
  }
}
