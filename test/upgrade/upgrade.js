const expectEvent = require('../helpers/expectEvent.js');
const assertRevert = require('../helpers/assertRevert.js');

//////////////////
// Tests for Proxy

var SomeProxy = artifacts.require("SomeProxy");
var Proxied = artifacts.require("Proxied");
var Proxied_V0 = artifacts.require("Proxied_V0");

contract("Proxy", (accounts) => {
  let proxy;

  beforeEach(async function () {
    proxy = await SomeProxy.new();
  });

  it("fordwards call", async function () {
    const expected = 42;
    const proxied = await Proxied_V0.new();
    await proxy.setImplementation(proxied.address);
    const instance = Proxied.at(proxy.address);

    await instance.setValue(expected);
    const value = (await instance.getValue()).toNumber();
    assert.equal(value, expected);
  });
});

/////////////////////////////////
// Test for UpgradeabilityStorage

var Proxied_V1 = artifacts.require("Proxied_V1");
var Storage = artifacts.require("UpgradeabilityStorage");

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("UpgradeabilityStorage", (accounts) => {
  let storage;
  let owner;

  beforeEach(async function () {
    storage = await Storage.new();
    owner = await storage.owner();
  });

  describe("version and implementation", function() {
    describe("when no initial version was provided", function() {
      it("no version and zero address", async function() {
        const version = await storage.version();
        assert.equal(version, "");
        const implementation = await storage.implementation();
        assert.equal(implementation, ZERO_ADDRESS);
      });
    });

    describe("when a version was provided", function() {
      let proxied;

      beforeEach(async function() {
        proxied = await Proxied_V0.new();
        await storage.upgradeTo("0", proxied.address, {from: owner})
      });

      it("returns the version and the implementation", async function() {
        const version = await storage.version();
        assert.equal(version, "0");

        const implementation = await storage.implementation();
        assert.equal(implementation, proxied.address);
      });
    });
  });

  describe("upgrade", function() {
    beforeEach(async function() {
      proxied = await Proxied_V0.new()
      await storage.upgradeTo("0", proxied.address, {from: owner})
    });

    it("assigns implementation", async function() {
      const version = await storage.version();
      assert.equal(version, "0");

      const implementation = await storage.implementation();
      assert.equal(implementation, proxied.address);
    });

    it("updates implementation", async function() {
      proxied = await Proxied_V1.new();
      await storage.upgradeTo("1", proxied.address, {from: owner})

      const version = await storage.version();
      assert.equal(version, "1");

      const implementation = await storage.implementation();
      assert.equal(implementation, proxied.address);
    });

    it("prevents assigning same implementation", async function() {
      await assertRevert(storage.upgradeTo("0", proxied.address, {from: owner}));
    });

    it("prevents assigning an null address", async function() {
      await assertRevert(storage.upgradeTo("0", ZERO_ADDRESS, {from: owner}));
    });

    it("only owner can upgrade", async function () {
      const other = accounts[1];
      assert.isTrue(owner != other);

      await assertRevert(storage.upgradeTo("0", proxied.address, {from: other}));
    });
  });

  describe("events", function() {
    it("emits event when the implementation is upgraded", async function () {
      const proxied = await Proxied_V0.new();
      const tx = await storage.upgradeTo("0", proxied.address, {from: owner});
      const e = await expectEvent.inTransaction(tx, "Upgraded");

      assert.equal(e.args.version, "0");
      assert.equal(e.args.implementation, proxied.address);
    });
  });
});

///////////////////////////////
// Test for UpgradeabilityProxy

var Proxy = artifacts.require("SomeUpgradeabilityProxy");

contract("UpgradeabilityProxy", (accounts) => {
  let proxy;
  let proxied_v0;
  let proxied_v1;

  beforeEach(async function () {
    proxy = await Proxy.new();
    proxied_v0 = await Proxied_V0.new();
    proxied_v1 = await Proxied_V1.new();
  });

  it("fordwards call", async function () {
    const expected = 42;
    const owner = await proxy.owner();
    const instance = Proxied.at(proxy.address);

    const tx = await proxy.upgradeTo("0", proxied_v0.address, {from: owner});
    const e = await expectEvent.inTransaction(tx, "Upgraded");
    assert.equal(e.args.version, "0");
    assert.equal(e.args.implementation, proxied_v0.address);

    await instance.setValue(expected);
    const value = (await instance.getValue()).toNumber();
    assert.equal(value, expected);
  });

  it("upgrades contract keeping state", async function () {
    const expected = 42;
    const owner = await proxy.owner();
    const instance = Proxied.at(proxy.address);
    await proxy.upgradeTo("0", proxied_v0.address, {from: owner});
    await instance.setValue(21);

    await proxy.upgradeTo("1", proxied_v1.address, {from: owner});

    value = (await instance.getValue()).toNumber();
    assert.equal(value, expected);
  });
});
