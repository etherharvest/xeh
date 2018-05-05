pragma solidity ^0.4.17;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Accessable.
 * @dev The Accessable contract has a map of addresses, and provides basic
 * access control functions.
 */
contract Accessable is Ownable {
  /**
   * Access list.
   */
  mapping(address => bool) internal acl;

  event AccessGranted(address indexed authorizedAddress);
  event AccessRevoked(address indexed unauthorizedAddress);

  /**
   * @dev The Accessable constructor.
   */
  function Accessable() public {}

  /**
   * @dev Throws if is called by an unauthorized account.
   */
  modifier onlyAuthorized() {
    require(acl[msg.sender]);
    _;
  }

  /**
   * @dev Grants access.
   *
   * @param _address Address to grant access.
   */
  function grantAccess(address _address) external onlyOwner {
    require(_address != address(0));
    require(!acl[_address]);
    emit AccessGranted(_address);
    acl[_address] = true;
  }

  /**
   * @dev Revokes access.
   *
   * @param _address Address to revoke access.
   */
  function revokeAccess(address _address) external onlyOwner {
    require(_address != address(0));
    require(acl[_address]);
    emit AccessRevoked(_address);
    delete acl[_address];
  }

  /**
   * @dev Whether or not has access to the contract.
   */
  function hasAccess(address _address) external view returns (bool) {
    return acl[_address];
  }
}
