const expectEvent = require('../helpers/expectEvent.js');
const assertRevert = require('../helpers/assertRevert.js');

//////////////////////
// Test for TokenProxy

var TokenProxy = artifacts.require("TokenProxy");
var Token_V0 = artifacts.require("ERC20BasicToken");
var Token_V1 = artifacts.require("ERC223Token");

contract("TokenProxy", ([_, owner, authorized, normal]) => {
  let proxy;

  beforeEach(async function () {
    proxy = await TokenProxy.new({from: owner});
  });

  describe("version and implementation", function() {
    let impl_v0;
    let token_v0;

    beforeEach(async function () {
      impl_v0 = await Token_V0.new();
      token_v0 = Token_V0.at(proxy.address);
    });

    describe("when no initial version was provided", function() {
      it("non version and the zero address are returned", async function() {
        const version = await proxy.version();
        const implementation = await proxy.implementation();

        assert.equal(version, "");
        assert.equal(implementation, 0x0);
      });
    });

    describe("when a version was provided", function() {
      const total = 1000;

      beforeEach(async function() {
        await proxy.grantAccess(authorized, {from: owner});
        await proxy.upgradeTo("version_0", impl_v0.address, {from: authorized});
      });

      it("returns the version and the implementation", async function() {
        const version = await proxy.version();
        const implementation = await proxy.implementation();

        assert.equal(version, "version_0");
        assert.equal(implementation, impl_v0.address);
      });

      describe("when the functions are called", function () {
        const amount = 100;
        beforeEach(async function () {
          await token_v0.initialize(total, {from: owner});
        });

        it("transfers requested amount", async function () {
          await token_v0.transfer(normal, amount, {from: owner});

          const senderBalance = (await token_v0.balanceOf(owner)).toNumber();
          assert.equal(total - amount, senderBalance);

          const receiverBalance = (await token_v0.balanceOf(normal)).toNumber();
          assert.equal(amount, receiverBalance);
        });
      });

      describe("when is updated", function () {
        let impl_v1;
        let token_v1;

        beforeEach(async function () {
          await token_v0.initialize(total, {from: owner});
          impl_v1 = await Token_V1.new();
          token_v1 = Token_V1.at(proxy.address);
          await proxy.upgradeTo("version_1", impl_v1.address, {from: authorized});
        });

        describe("when the functions are called", function () {
          const amount = 100;

          it("transfers requested amount", async function () {
            await token_v1.transfer(normal, amount, "", {from: owner});

            const senderBalance = (await token_v1.balanceOf(owner)).toNumber();
            assert.equal(total - amount, senderBalance);

            const receiverBalance = (await token_v1.balanceOf(normal)).toNumber();
            assert.equal(amount, receiverBalance);
          });
        });
      });
    });
  });
});
