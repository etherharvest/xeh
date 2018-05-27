const expectEvent = require('../helpers/expectEvent.js');
const assertRevert = require('../helpers/assertRevert.js');

///////////////////////////
// Tests for EternalStorage

var Storage = artifacts.require("EternalStorage");
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("EternalStorage", ([_, owner, authorized, unauthorized]) => {
  const key = "0x42";
  let storage;

  describe("Unsigned integer", function () {
    const value = 42;

    beforeEach(async function () {
      storage = await Storage.new({from: owner});
      await storage.grantAccess(authorized, {from: owner});
    });

    it("when authorized sets value", async function () {
      const expected = value;
      await storage.setUint(key, value, {from: authorized});

      const result = (await storage.getUint(key)).toNumber();
      assert.equal(expected, result);
    });

    it("when unauthorized cannot set the value", async function () {
      await assertRevert(storage.setUint(key, value, {from: unauthorized}));
    });

    it("when authorized deletes value", async function() {
      await storage.setUint(key, value, {from: authorized});
      await storage.deleteUint(key, {from: authorized});

      const expected = 0;
      const result = (await storage.getUint(key)).toNumber();
      assert.equal(expected, result);
    });

    it("when unauthorized cannot delete the value", async function () {
      const expected = value;
      await storage.setUint(key, value, {from: authorized});
      await assertRevert(storage.deleteUint(key, {from: unauthorized}));
      const result = await storage.getUint(key);
      assert.equal(expected, result);
    });
  });

  describe("Integer", function () {
    const value = 42;

    beforeEach(async function () {
      storage = await Storage.new({from: owner});
      await storage.grantAccess(authorized, {from: owner});
    });

    it("when authorized sets value", async function () {
      const expected = value;
      await storage.setInt(key, value, {from: authorized});

      const result = (await storage.getInt(key)).toNumber();
      assert.equal(expected, result);
    });

    it("when unauthorized cannot set the value", async function () {
      await assertRevert(storage.setInt(key, value, {from: unauthorized}));
    });

    it("when authorized deletes value", async function() {
      await storage.setInt(key, value, {from: authorized});
      await storage.deleteInt(key, {from: authorized});

      const expected = 0;
      const result = (await storage.getInt(key)).toNumber();
      assert.equal(expected, result);
    });

    it("when unauthorized cannot delete the value", async function () {
      const expected = value;
      await storage.setInt(key, value, {from: authorized});
      await assertRevert(storage.deleteInt(key, {from: unauthorized}));
      const result = await storage.getInt(key);
      assert.equal(expected, result);
    });
  });

  describe("Boolean", function () {
    const value = true;

    beforeEach(async function () {
      storage = await Storage.new({from: owner});
      await storage.grantAccess(authorized, {from: owner});
    });

    it("when authorized sets value", async function () {
      const expected = value;
      await storage.setBool(key, value, {from: authorized});

      const result = await storage.getBool(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot set the value", async function () {
      await assertRevert(storage.setBool(key, value, {from: unauthorized}));
    });

    it("when authorized deletes value", async function() {
      await storage.setBool(key, value, {from: authorized});
      await storage.deleteBool(key, {from: authorized});

      const expected = false;
      const result = await storage.getBool(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot delete the value", async function () {
      const expected = value;
      await storage.setBool(key, value, {from: authorized});
      await assertRevert(storage.deleteBool(key, {from: unauthorized}));
      const result = await storage.getBool(key);
      assert.equal(expected, result);
    });
  });

  describe("String", function () {
    const value = "foo";

    beforeEach(async function () {
      storage = await Storage.new({from: owner});
      await storage.grantAccess(authorized, {from: owner});
    });

    it("when authorized sets value", async function () {
      const expected = value;
      await storage.setString(key, value, {from: authorized});

      const result = await storage.getString(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot set the value", async function () {
      await assertRevert(storage.setString(key, value, {from: unauthorized}));
    });

    it("when authorized deletes value", async function() {
      await storage.setString(key, value, {from: authorized});
      await storage.deleteString(key, {from: authorized});

      const expected = "";
      const result = await storage.getBool(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot delete the value", async function () {
      const expected = value;
      await storage.setString(key, value, {from: authorized});
      await assertRevert(storage.deleteString(key, {from: unauthorized}));
      const result = await storage.getString(key);
      assert.equal(expected, result);
    });
  });

  describe("Address", function () {
    const value = owner;

    beforeEach(async function () {
      storage = await Storage.new({from: owner});
      await storage.grantAccess(authorized, {from: owner});
    });

    it("when authorized sets value", async function () {
      const expected = value;
      await storage.setAddress(key, value, {from: authorized});

      const result = await storage.getAddress(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot set the value", async function () {
      await assertRevert(storage.setAddress(key, value, {from: unauthorized}));
    });

    it("when authorized deletes value", async function() {
      await storage.setAddress(key, value, {from: authorized});
      await storage.deleteAddress(key, {from: authorized});

      const expected = ZERO_ADDRESS;
      const result = await storage.getAddress(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot delete the value", async function () {
      const expected = value;
      await storage.setAddress(key, value, {from: authorized});
      await assertRevert(storage.deleteAddress(key, {from: unauthorized}));
      const result = await storage.getAddress(key);
      assert.equal(expected, result);
    });
  });

  describe("Bytes", function () {
    const value = "0x0000000000000000000000000000000000000000000000000000000000000042";

    beforeEach(async function () {
      storage = await Storage.new({from: owner});
      await storage.grantAccess(authorized, {from: owner});
    });

    it("when authorized sets value", async function () {
      const expected = value;
      await storage.setBytes(key, value, {from: authorized});

      const result = await storage.getBytes(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot set the value", async function () {
      await assertRevert(storage.setBytes(key, value, {from: unauthorized}));
    });

    it("when authorized deletes value", async function() {
      await storage.setBytes(key, value, {from: authorized});
      await storage.deleteBytes(key, {from: authorized});

      const expected = "0x0000000000000000000000000000000000000000000000000000000000000000";
      const result = await storage.getBytes(key);
      assert.equal(expected, result);
    });

    it("when unauthorized cannot delete the value", async function () {
      const expected = value;
      await storage.setBytes(key, value, {from: authorized});
      await assertRevert(storage.deleteBytes(key, {from: unauthorized}));
      const result = await storage.getBytes(key);
      assert.equal(expected, result);
    });
  });
});
