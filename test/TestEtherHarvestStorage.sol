pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/EtherHarvestStorage.sol";
import "./utils/ThrowProxy.sol";

contract TestEtherHarvestStorage {
  EtherHarvestStorage deployed =
    EtherHarvestStorage(DeployedAddresses.EtherHarvestStorage()
  );

  function testGetBoolNonExistent() public {
    bytes32 key = "test.non.existent";
    ThrowProxy throwProxy = new ThrowProxy(address(deployed));

    EtherHarvestStorage(address(throwProxy)).getBool(key);
    bool result = throwProxy.execute.gas(200000)();
    Assert.isFalse(result, "Should be false as it should throw");
  }

  function testBoolStorage() public {
    EtherHarvestStorage store = new EtherHarvestStorage();
    bytes32 key = "test.get.bool";
    bool expected = true;

    store.grantAccess(address(this));
    store.setBool(key, expected);
    bool value = store.getBool(key);
    Assert.equal(value, expected, "Should get boolean value");
  }

  function testDeleteBool() public {
    EtherHarvestStorage store = new EtherHarvestStorage();
    bytes32 key  = "test.delete.bool";
    ThrowProxy throwProxy = new ThrowProxy(address(store));
    EtherHarvestStorage(address(throwProxy)).getBool(key);

    store.grantAccess(address(this));
    store.setBool(key, true);
    store.getBool(key);
    store.deleteBool(key);
    bool result = throwProxy.execute.gas(200000)();
    Assert.isFalse(result, "Should be false as it is deleted");
  }
}
