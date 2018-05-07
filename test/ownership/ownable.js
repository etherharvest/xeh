const expectEvent = require('../helpers/expectEvent.js');
const assertRevert = require('../helpers/assertRevert.js');

////////////////////////////
// Test for Ownable contract

var Ownable = artifacts.require("Ownable");

contract("Ownable", (accounts) => {
  let ownable;

  beforeEach(async function () {
    ownable = await Ownable.new();
  });

  it("should have an owner", async function () {
    const owner = await ownable.owner();
    assert.isTrue(owner !== 0);
  });

  it("changes owner after transfer", async function () {
    let owner = await ownable.owner();
    const other = accounts[1];

    const tx = await ownable.transferOwnership(other, {from: owner});

    const e = await expectEvent.inTransaction(tx, "OwnershipTransferred");
    assert.isTrue(e.args.previousOwner === owner);
    assert.isTrue(e.args.newOwner === other);

    owner = await ownable.owner();
    assert.isTrue(owner === other);
  });

  it("should prevent non-owners from transfering", async function () {
    const owner = await ownable.owner();
    const other = accounts[2];

    assert.isTrue(owner != other);
    await assertRevert(ownable.transferOwnership(other, {from: other}));
  });

  it("should guard ownership against stuck state", async function () {
    const owner =  await ownable.owner();
    await assertRevert(ownable.transferOwnership(null, {from: owner}));
  });
});
