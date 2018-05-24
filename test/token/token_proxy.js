const expectEvent = require('../helpers/expectEvent.js');
const assertRevert = require('../helpers/assertRevert.js');

//////////////////////
// Test for TokenProxy

var TokenProxy = artifacts.require("TokenProxy");
var Token_V0 = artifacts.require("Token_V0");
var Token_V1 = artifacts.require("Token_V1");

contract("TokenProxy", ([_, proxyOwner, tokenOwner, anotherAccount]) => {
  let proxy;
  let impl_v0;
  let impl_v1;
  let token_v0;
  let token_v1;

  beforeEach(async function () {
    proxy = await TokenProxy.new({from: proxyOwner});
    impl_v0 = await Token_V0.new();
    impl_v1 = await Token_V1.new();
    token_v0 = Token_V0.at(proxy.address);
    token_v1 = Token_V1.at(proxy.address)
  });

  describe("version and implementation", function() {
    describe("when no initial version was provided", function() {
      it("non version and the zero address are returned", async function() {
        const version = await proxy.version();
        const implementation = await proxy.implementation();

        assert.equal(version, "");
        assert.equal(implementation, 0x0);
      });
    });

    describe("when a version was provided", function() {
      beforeEach(async function() {
        proxy.upgradeTo("version_0", impl_v0.address, {from: proxyOwner});
      });

      it("returns the version and the implementation", async function() {
        const version = await proxy.version();
        const implementation = await proxy.implementation();

        assert.equal(version, "version_0");
        assert.equal(implementation, impl_v0.address);
      });
    });
  });
});
