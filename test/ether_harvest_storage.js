const assertRevert = require('./helpers/assertRevert.js');

/////////////////////////////////////////
// Tests for EtherHarvestStorage contract

var Storage = artifacts.require("EtherHarvestStorage");

contract("EtherHarvestStorage", (accounts) => {
  let storage;
  let owner;
  let authorized = accounts[1];
  let unauthorized = accounts[2];
  const key = "test.storage";

  beforeEach(async function () {
    storage = await Storage.new();
    owner = await storage.owner();
    await storage.grantAccess(authorized, {from: owner})
  });

  ////////////////
  // Boolean tests

  it("BOOL: sets a value", async function () {
    const expected = false;

    await storage.setBool(key, expected, {from: authorized});
    const result = await storage.hasBool(key);
    assert.isTrue(result);

    const value = await storage.getBool(key);
    assert.isTrue(value === expected);
  });

  it("BOOL: doesn't set value for unauthorized address", async function () {
    await assertRevert(storage.setBool(key, false, {from: unauthorized}));
  });

  it("BOOL: gets a without authorization", async function () {
    const expected = false;

    await storage.setBool(key, expected, {from: authorized});
    const value = await storage.getBool(key, {from: unauthorized});
    assert.isTrue(expected === value)
  });

  it("BOOL: prevents getting uninitialized values", async function () {
    await assertRevert(storage.getBool(key));
  });

  it("BOOL: checks whether or not the value exists", async function () {
    let result = await storage.hasBool(key);
    assert.isFalse(result);

    await storage.setBool(key, false, {from: authorized});
    result = await storage.hasBool(key);
    assert.isTrue(result);

    await storage.deleteBool(key, {from: authorized});
    result = await storage.hasBool(key);
    assert.isFalse(result);
  });

  it("BOOL: deletes a value", async function () {
    await storage.setBool(key, false, {from: authorized});

    await storage.deleteBool(key, {from: authorized});
    const result = await storage.hasBool(key);
    assert.isFalse(result);
  });

  it("BOOL: doesn't delete a value for unauthorized address", async function () {
    await storage.setBool(key, false, {from: authorized});
    await assertRevert(storage.deleteBool(key));
  });

  ////////////////
  // Integer tests

  it("INT: sets a value", async function () {
    const expected = 42;

    await storage.setInt(key, expected, {from: authorized});
    const result = await storage.hasInt(key);
    assert.isTrue(result);

    const value = (await storage.getInt(key)).toNumber();
    assert.isTrue(value === expected);
  });

  it("INT: doesn't set value for unauthorized address", async function () {
    await assertRevert(storage.setInt(key, 42, {from: unauthorized}));
  });

  it("INT: gets a without authorization", async function () {
    const expected = 42;

    await storage.setInt(key, expected, {from: authorized});
    const value = (await storage.getInt(key, {from: unauthorized})).toNumber();
    assert.isTrue(expected === value)
  });

  it("INT: prevents getting uninitialized values", async function () {
    await assertRevert(storage.getInt(key));
  });

  it("INT: checks whether or not the value exists", async function () {
    let result = await storage.hasInt(key);
    assert.isFalse(result);

    await storage.setInt(key, 42, {from: authorized});
    result = await storage.hasInt(key);
    assert.isTrue(result);

    await storage.deleteInt(key, {from: authorized});
    result = await storage.hasInt(key);
    assert.isFalse(result);
  });

  it("INT: deletes a value", async function () {
    await storage.setInt(key, 42, {from: authorized});

    await storage.deleteInt(key, {from: authorized});
    const result = await storage.hasInt(key);
    assert.isFalse(result);
  });

  it("INT: doesn't delete a value for unauthorized address", async function () {
    await storage.setInt(key, 42, {from: authorized});
    await assertRevert(storage.deleteInt(key));
  });

  /////////////////////////
  // Unsigned integer tests

  it("UINT: sets a value", async function () {
    const expected = 42;

    await storage.setUint(key, expected, {from: authorized});
    const result = await storage.hasUint(key);
    assert.isTrue(result);

    const value = (await storage.getUint(key)).toNumber();
    assert.isTrue(value === expected);
  });

  it("UINT: doesn't set value for unauthorized address", async function () {
    await assertRevert(storage.setUint(key, 42, {from: unauthorized}));
  });

  it("UINT: gets a without authorization", async function () {
    const expected = 42;

    await storage.setUint(key, expected, {from: authorized});
    const value = (await storage.getUint(key, {from: unauthorized})).toNumber();
    assert.isTrue(expected === value)
  });

  it("UINT: prevents getting uninitialized values", async function () {
    await assertRevert(storage.getUint(key));
  });

  it("UINT: checks whether or not the value exists", async function () {
    let result = await storage.hasUint(key);
    assert.isFalse(result);

    await storage.setUint(key, 42, {from: authorized});
    result = await storage.hasUint(key);
    assert.isTrue(result);

    await storage.deleteUint(key, {from: authorized});
    result = await storage.hasUint(key);
    assert.isFalse(result);
  });

  it("UINT: deletes a value", async function () {
    await storage.setUint(key, 42, {from: authorized});

    await storage.deleteUint(key, {from: authorized});
    const result = await storage.hasUint(key);
    assert.isFalse(result);
  });

  it("UINT: doesn't delete a value for unauthorized address", async function () {
    await storage.setUint(key, 42, {from: authorized});
    await assertRevert(storage.deleteUint(key));
  });

  ///////////////
  // String tests

  it("STRING: sets a value", async function () {
    const expected = "foo";

    await storage.setString(key, expected, {from: authorized});
    const result = await storage.hasString(key);
    assert.isTrue(result);

    const value = (await storage.getString(key)).toString();
    assert.isTrue(value === expected);
  });

  it("STRING: doesn't set value for unauthorized address", async function () {
    await assertRevert(storage.setString(key, "foo", {from: unauthorized}));
  });

  it("STRING: gets a without authorization", async function () {
    const expected = "foo";

    await storage.setString(key, expected, {from: authorized});
    const value = (await storage.getString(key, {from: unauthorized})).toString();
    assert.isTrue(expected === value)
  });

  it("STRING: prevents getting uninitialized values", async function () {
    await assertRevert(storage.getString(key));
  });

  it("STRING: checks whether or not the value exists", async function () {
    let result = await storage.hasString(key);
    assert.isFalse(result);

    await storage.setString(key, "foo", {from: authorized});
    result = await storage.hasString(key);
    assert.isTrue(result);

    await storage.deleteString(key, {from: authorized});
    result = await storage.hasString(key);
    assert.isFalse(result);
  });

  it("STRING: deletes a value", async function () {
    await storage.setString(key, "foo", {from: authorized});

    await storage.deleteString(key, {from: authorized});
    const result = await storage.hasString(key);
    assert.isFalse(result);
  });

  it("STRING: doesn't delete a value for unauthorized address", async function () {
    await storage.setString(key, "foo", {from: authorized});
    await assertRevert(storage.deleteString(key));
  });

  ///////////////
  // Address tests

  it("ADDRESS: sets a value", async function () {
    const expected = owner;

    await storage.setAddress(key, expected, {from: authorized});
    const result = await storage.hasAddress(key);
    assert.isTrue(result);

    const value = (await storage.getAddress(key)).toString();
    assert.isTrue(value === expected);
  });

  it("ADDRESS: doesn't set value for unauthorized address", async function () {
    await assertRevert(storage.setAddress(key, owner, {from: unauthorized}));
  });

  it("ADDRESS: gets a without authorization", async function () {
    const expected = owner;

    await storage.setAddress(key, expected, {from: authorized});
    const value = (await storage.getAddress(key, {from: unauthorized})).toString();
    assert.isTrue(expected === value)
  });

  it("ADDRESS: prevents getting uninitialized values", async function () {
    await assertRevert(storage.getAddress(key));
  });

  it("ADDRESS: checks whether or not the value exists", async function () {
    let result = await storage.hasAddress(key);
    assert.isFalse(result);

    await storage.setAddress(key, owner, {from: authorized});
    result = await storage.hasAddress(key);
    assert.isTrue(result);

    await storage.deleteAddress(key, {from: authorized});
    result = await storage.hasAddress(key);
    assert.isFalse(result);
  });

  it("ADDRESS: deletes a value", async function () {
    await storage.setAddress(key, owner, {from: authorized});

    await storage.deleteAddress(key, {from: authorized});
    const result = await storage.hasAddress(key);
    assert.isFalse(result);
  });

  it("ADDRESS: doesn't delete a value for unauthorized address", async function () {
    await storage.setAddress(key, owner, {from: authorized});
    await assertRevert(storage.deleteAddress(key));
  });

  //////////////
  // Bytes tests

  it("BYTES: sets a value", async function () {
    const expected = "0x666f6f";

    await storage.setBytes(key, expected, {from: authorized});
    const result = await storage.hasBytes(key);
    assert.isTrue(result);

    const value = await storage.getBytes(key);
    assert.isTrue(value === expected);
  });

  it("BYTES: doesn't set value for unauthorized address", async function () {
    await assertRevert(storage.setBytes(key, "foo", {from: unauthorized}));
  });

  it("BYTES: gets a without authorization", async function () {
    const expected = "0x666f6f";

    await storage.setBytes(key, expected, {from: authorized});
    const value = await storage.getBytes(key, {from: unauthorized});
    assert.isTrue(expected === value)
  });

  it("BYTES: prevents getting uninitialized values", async function () {
    await assertRevert(storage.getBytes(key));
  });

  it("BYTES: checks whether or not the value exists", async function () {
    let result = await storage.hasBytes(key);
    assert.isFalse(result);

    await storage.setBytes(key, "0x666f6f", {from: authorized});
    result = await storage.hasBytes(key);
    assert.isTrue(result);

    await storage.deleteBytes(key, {from: authorized});
    result = await storage.hasBytes(key);
    assert.isFalse(result);
  });

  it("BYTES: deletes a value", async function () {
    await storage.setBytes(key, "0x666f6f", {from: authorized});

    await storage.deleteBytes(key, {from: authorized});
    const result = await storage.hasBytes(key);
    assert.isFalse(result);
  });

  it("BYTES: doesn't delete a value for unauthorized address", async function () {
    await storage.setBytes(key, "0x666f6f", {from: authorized});
    await assertRevert(storage.deleteBytes(key));
  });
});
