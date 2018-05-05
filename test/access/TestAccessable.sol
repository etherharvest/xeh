pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "../../contracts/access/Accessable.sol";
import "../utils/ThrowProxy.sol";

contract TestAccessable {
  function testGrantAccess() public {
    Accessable accessable = new Accessable();
    accessable.grantAccess(address(this));
    bool result = accessable.hasAccess(address(this));
    Assert.isTrue(result, "Should be true because the access has been granted");
  }

  function testRevokeAccess() public {
    Accessable accessable = new Accessable();
    accessable.grantAccess(address(this));
    bool result = accessable.hasAccess(address(this));
    Assert.isTrue(result, "Should be true because the access has been granted");
    accessable.revokeAccess(address(this));
    result = accessable.hasAccess(address(this));
    Assert.isFalse(result, "Should be false because the access has been revoked");
  }

  function testAccessAlreadyGranted() {
    Accessable accessable = new Accessable();
    ThrowProxy throwProxy = new ThrowProxy(address(accessable));
    accessable.grantAccess(address(this));
    accessable.transferOwnership(address(this));

    Accessable(address(throwProxy)).grantAccess(address(this));
    bool result = throwProxy.execute.gas(200000)();
    Assert.isFalse(result, "Should be false as it should throw");
  }

  function testAccessAlreadyRevoked() {
    Accessable accessable = new Accessable();
    ThrowProxy throwProxy = new ThrowProxy(address(accessable));
    accessable.transferOwnership(address(this));

    Accessable(address(throwProxy)).revokeAccess(address(this));
    bool result = throwProxy.execute.gas(200000)();
    Assert.isFalse(result, "Should be false as it should throw");
  }
}
