const expectEvent = require('../../helpers/expectEvent.js');
const assertRevert = require('../../helpers/assertRevert.js');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

///////////////////////
// Tests for ERC20Basic

var Basic = artifacts.require("BasicToken");

contract("ERC20Basic", function ([_, owner, alice, bob]) {
  const total = 1000;
  let token;

  beforeEach(async function () {
    token = await Basic.new({from: owner});
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
    describe("when the recipient is the zero address", function () {
      it("reverts", async function () {
        await assertRevert(token.transfer(ZERO_ADDRESS, total, {from: owner}))
      });
    });

    describe("when the recipient is not the zero address", function () {
      describe("when the sender doesn't have enough balance", async function () {
        it("reverts", async function () {
          await assertRevert(token.transfer(alice, total, {from: bob}));
        });
      });

      describe("when the sender has enough balance", function () {
        const amount = 100;
        it("transfers the requested amount", async function () {
          await token.transfer(alice, amount, {from: owner});

          const senderBalance = (await token.balanceOf(owner)).toNumber();
          assert.equal(total - amount, senderBalance);

          const receiverBalance = (await token.balanceOf(alice)).toNumber();
          assert.equal(amount, receiverBalance);
        });

        it("emits a Transfer event", async function () {
          const tx = await token.transfer(alice, amount, {from: owner});
          const e = await expectEvent.inTransaction(tx, "Transfer");

          assert.equal(e.args.from, owner);
          assert.equal(e.args.to, alice);
          assert.equal(e.args.value, amount);
        });
      });
    });
  });
});

//////////////////
// Tests for ERC20

var Standard = artifacts.require("StandardToken");

contract("ERC20", function ([_, owner, alice, bob]) {
  const total = 1000;
  let token;

  beforeEach(async function () {
    token = await Standard.new({from: owner});
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
    describe("when the recipient is the zero address", function () {
      it("reverts", async function () {
        await assertRevert(token.transfer(ZERO_ADDRESS, total, {from: owner}))
      });
    });

    describe("when the recipient is not the zero address", function () {
      describe("when the sender doesn't have enough balance", async function () {
        it("reverts", async function () {
          await assertRevert(token.transfer(alice, total, {from: bob}));
        });
      });

      describe("when the sender has enough balance", function () {
        const amount = 100;
        it("transfers the requested amount", async function () {
          await token.transfer(alice, amount, {from: owner});

          const senderBalance = (await token.balanceOf(owner)).toNumber();
          assert.equal(total - amount, senderBalance);

          const receiverBalance = (await token.balanceOf(alice)).toNumber();
          assert.equal(amount, receiverBalance);
        });

        it("emits a Transfer event", async function () {
          const tx = await token.transfer(alice, amount, {from: owner});
          const e = await expectEvent.inTransaction(tx, "Transfer");

          assert.equal(e.args.from, owner);
          assert.equal(e.args.to, alice);
          assert.equal(e.args.value, amount);
        });
      });
    });
  });

  describe("allowance", function () {
    const spender = alice;

    describe("when the requested account has no approved tokens", function () {
      it("returns zero", async function () {
        const allowance = (await token.allowance(owner, spender)).toNumber();
        assert.equal(allowance, 0);
      });
    });

    describe("when the requested account has approved tokens", function () {
      const amount = 100;

      beforeEach(async function () {
        await token.approve(spender, amount, {from: owner});
      });

      it("returns the amount of approved tokens", async function () {
        const allowance = (await token.allowance(owner, spender)).toNumber();
        assert.equal(allowance, amount);
      });
    });
  });

  describe("approve", function () {
    describe("when the spender is not the zero address", function (){
      const spender = bob;

      describe("when the sender has enough balance", function () {
        const amount = 100;

        it("emits an approval event", async function () {
          const tx = await token.approve(spender, amount, {from: owner});
          const e = await expectEvent.inTransaction(tx, "Approval");

          assert.equal(e.args.owner, owner);
          assert.equal(e.args.spender, spender);
          assert.equal(e.args.value, amount);
        });

        describe("when there was no approved amount before", function () {
          it("approves the requested amount", async function () {
            await token.approve(spender, amount, {from: owner});

            const allowance = await token.allowance(owner, spender)
            assert.equal(allowance, amount);
          });
        });

        describe("when the spender had an approved amount", function () {
          beforeEach(async function () {
            await token.approve(spender, 1, {from: owner});
          });

          it("approves the requested amount and replaces the previous one", async function () {
            await token.approve(spender, amount, {from: owner});

            const allowance = await token.allowance(owner, spender)
            assert.equal(allowance, amount);
          });
        });
      });
    });

    describe("when the spender is the zero address", function () {
      const amount = 100;
      const spender = ZERO_ADDRESS;

      it("approves the requested amount", async function () {
        await token.approve(spender, amount, {from: owner});
        const allowance = await token.allowance(owner, spender);
        assert.equal(allowance, amount);
      });

      it("emits approval event", async function () {
        const tx = await token.approve(spender, amount, {from: owner});
        const e = await expectEvent.inTransaction(tx, "Approval");

        assert.equal(e.args.owner, owner);
        assert.equal(e.args.spender, spender);
        assert.equal(e.args.value, amount);
      });
    });

    describe("when the sender does not have enough balance", async function () {
      const amount = 100;
      const owner = alice;
      const spender = bob;

      it("emits approval event", async function () {
        const tx = await token.approve(spender, amount, {from: owner});
        const e = await expectEvent.inTransaction(tx, "Approval");

        assert.equal(e.args.owner, owner);
        assert.equal(e.args.spender, spender);
        assert.equal(e.args.value, amount);
      });

      describe("when there was no approved amount before", function () {
        it("approves the requested amount", async function () {
          await token.approve(spender, amount, {from: owner});

          const allowance = await token.allowance(owner, spender)
          assert.equal(allowance, amount);
        });
      });

      describe("when the spender had an approved amount", function () {
        beforeEach(async function () {
          await token.approve(spender, 1, {from: owner});
        });

        it("approves the requested amount and replaces the previous one", async function () {
          await token.approve(spender, amount, {from: owner});

          const allowance = await token.allowance(owner, spender)
          assert.equal(allowance, amount);
        });
      });
    });
  });

  describe("transfer from", function () {
    const spender = alice;

    describe("when the recipient is not the zero address", function () {
      const amount = 100;
      const to = bob;

      describe("when the spender has enough approved balance", function () {
        beforeEach(async function () {
          await token.approve(spender, amount, {from: owner});
        });

        describe("when the owner has enough balance", function () {
          it("transfers the requested amount", async function () {
            await token.transferFrom(owner, to, amount, {from: spender});

            const senderBalance = (await token.balanceOf(owner)).toNumber();
            assert.equal(senderBalance, total - amount);

            const recipientBalance = (await token.balanceOf(to)).toNumber();
            assert.equal(recipientBalance, amount);
          });

          it("decreases the spender allowance", async function () {
            await token.transferFrom(owner, to, amount, {from: spender});

            const allowance = (await token.allowance(owner, spender));
            assert.equal(allowance, 0)
          });

          it("emits a transfer event", async function () {
            const tx = await token.transferFrom(owner, to, amount, {from: spender});
            const e = await expectEvent.inTransaction(tx, "Transfer");

            assert.equal(e.args.from, owner);
            assert.equal(e.args.to, to);
            assert.equal(e.args.value, amount);
          });

          describe("when the spender does not have enough approved balance", function () {
            beforeEach(async function () {
              await token.approve(spender, amount - 1, {from: owner});
            });

            describe("when the owner has enough balance", function () {
              it("reverts", async function () {
                await assertRevert(token.transferFrom(owner, to, amount, {from: spender}));
              });
            });

            describe("when the owner does not have enough balance", function () {
              it("reverts", async function () {
                await assertRevert(token.transferFrom(owner, to, total + 1, {from: spender}));
              });
            });
          });
        });

        describe("when the recipient is the zero address", function () {
          const to = ZERO_ADDRESS;

          beforeEach(async function () {
            await token.approve(spender, amount, {from: owner});
          });

          it("reverts", async function () {
              await assertRevert(token.transferFrom(owner, to, amount, {from: spender}));
          });
        });
      });
    });
  });
});
