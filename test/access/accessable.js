const expectEvent = require('../helpers/expectEvent.js');
const assertRevert = require('../helpers/assertRevert.js');

///////////////////////////////
// Test for Accessable contract

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

var Accessable = artifacts.require("Accessable");
var Accessible = artifacts.require("Accessible");

contract("Accessable", (accounts) => {
  let accessable;

  beforeEach(async function () {
    accessable = await Accessable.new();
  });

  it("grants access", async function () {
    const owner = await accessable.owner();

    const tx = await accessable.grantAccess(owner, {from: owner});
    const e = await expectEvent.inTransaction(tx, "AccessGranted");
    assert.isTrue(e.args.authorizedAddress === owner);

    const result = await accessable.hasAccess(owner);
    assert.isTrue(result);
  });

  it("doesn't grant access to 0x0 address", async function () {
    const owner = await accessable.owner();

    await assertRevert(accessable.grantAccess(ZERO_ADDRESS, {from: owner}));
  });

  it("revokes access", async function () {
    const owner = await accessable.owner();

    await accessable.grantAccess(owner, {from: owner});

    const tx = await accessable.revokeAccess(owner, {from: owner});
    const e = await expectEvent.inTransaction(tx, "AccessRevoked");
    assert.isTrue(e.args.unauthorizedAddress === owner);

    const result = await accessable.hasAccess(owner);
    assert.isFalse(result);
  });

  it("doesn't revoke access to 0x0 address", async function () {
    const owner = await accessable.owner();

    await assertRevert(accessable.revokeAccess(ZERO_ADDRESS, {from: owner}));
  });

  describe("Accessable contract", function() {
    let accessible;
    const other = accounts[1];

    beforeEach(async function() {
      accessible = await Accessible.new();
    });

    it("reverts when unauthorized to call a function", async function () {
      await assertRevert(accessible.getAuthorizedValue());
    });

    it("call the function when authorized", async function () {
      const owner = await accessible.owner();
      await accessible.grantAccess(other, {from: owner});

      const value =
        (await accessible.getAuthorizedValue({from: other})).toNumber();
      assert.isTrue(value === 42);
    });
  });
});
