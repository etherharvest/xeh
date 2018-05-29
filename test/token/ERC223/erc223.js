const expectEvent = require('../../helpers/expectEvent.js');
const assertRevert = require('../../helpers/assertRevert.js');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_DATA = '0x0000000000000000000000000000000000000000000000000000000000000000';

///////////////////
// Tests for ERC223

var Token = artifacts.require("ERC223Token");
var Receiver = artifacts.require("ERC223TokenReceiver");

contract("ERC223", function ([_, owner, alice, bob]) {
  const total = 1000;
  let token;

  beforeEach(async function () {
    token = await Token.new({from: owner});
    await token.initialize(total, {from: owner});
  });

  describe("totalSupply", function () {
    it("returns the total supply", async function () {
      const result = (await token.totalSupply()).toNumber();
      assert.equal(total, result);
    });
  });

  describe("balanceOf", function () {
    describe("when the requested account has no tokens", function () {
      it("returns zero", async function () {
        const balance = (await token.balanceOf(alice)).toNumber();
        assert.equal(balance, 0);
      });
    });

    describe("when the requested account has tokens", function () {
      it("returns the amount of tokens", async function () {
        const balance = (await token.balanceOf(owner)).toNumber();
        assert.equal(balance, total);
      });
    });
  });

  describe("transfer", function () {
    describe("when is called without data", function () {
      const amount = 100;
      it("transfers the requested amount", async function () {
        await token.contract.transfer['address,uint256'](alice, amount, {from: owner});

        const senderBalance = (await token.balanceOf(owner)).toNumber();
        assert.equal(total - amount, senderBalance);

        const receiverBalance = (await token.balanceOf(alice)).toNumber();
        assert.equal(amount, receiverBalance);
      });
    });

    describe("when the recipient is the zero address", function () {
      it("reverts", async function () {
        await assertRevert(
          token.transfer(ZERO_ADDRESS, total, "", {from: owner})
        );
      });
    });

    describe("when the recipient is not the zero address", function () {
      describe("when the sender doesn't have enough balance", function () {
        it("reverts", async function () {
          await assertRevert(
            token.transfer(alice, total, "", {from: bob})
          );
        });
      });

      describe("when the sender has enough balance", function () {
        const amount = 100;
        it("transfers the requested amount", async function () {
          await token.transfer(alice, amount, "", {from: owner});

          const senderBalance = (await token.balanceOf(owner)).toNumber();
          assert.equal(total - amount, senderBalance);

          const receiverBalance = (await token.balanceOf(alice)).toNumber();
          assert.equal(amount, receiverBalance);
        });

        it("emits a Transfer event", async function () {
          const tx = await token.transfer(alice, amount, "", {from: owner});

          assert.equal(tx.logs[0].args.from, owner);
          assert.equal(tx.logs[0].args.to, alice);
          assert.equal(tx.logs[0].args.value, amount);

          assert.equal(tx.logs[1].args.from, owner);
          assert.equal(tx.logs[1].args.to, alice);
          assert.equal(tx.logs[1].args.value, amount);
          assert.equal(tx.logs[1].args.data, ZERO_DATA);
        });
      });
    });

    describe("when the transfer is to a contract", function () {
      const amount = 100;

      describe("when the contract does not have token fallback", function () {
        it("reverts", async function () {
          await assertRevert(
            token.transfer(token.address, amount, "", {from: owner})
          );
        });
      });

      describe("when the contract does have token fallback", function () {
        let receiver;

        beforeEach(async function () {
          receiver = await Receiver.new({from: owner});
          await receiver.addContract(token.address, {from: owner});
        });

        it("transfers the requested amount", async function () {
          await token.transfer(receiver.address, amount, "", {from: owner});

          const senderBalance = (await token.balanceOf(owner)).toNumber();
          assert.equal(total - amount, senderBalance);

          const receiverBalance = (await token.balanceOf(receiver.address)).toNumber();
          assert.equal(amount, receiverBalance);
        });

        it("emits a Transfer event", async function () {
          const tx = await token.transfer(receiver.address, amount, "", {from: owner});

          assert.equal(tx.logs[0].args.from, owner);
          assert.equal(tx.logs[0].args.to, receiver.address);
          assert.equal(tx.logs[0].args.value, amount);

          assert.equal(tx.logs[1].args.from, owner);
          assert.equal(tx.logs[1].args.to, receiver.address);
          assert.equal(tx.logs[1].args.value, amount);
          assert.equal(tx.logs[1].args.data, ZERO_DATA);
        });
      });
    });
  });
});
