const { expectRevert, time } = require('@openzeppelin/test-helpers');
const Taowa = artifacts.require('Taowa.sol');

contract('Taowa', ([]) => {

  beforeEach(async () => {});

  it('Create token', async () => {
    const taowa = await Taowa.deployed();
    const result = await taowa.create("abc", "def");

    const logs = result.logs

    for (const log of logs) {
      assert.equal(log.event, "Created")

      const args = log.args;
      console.log(args)

      assert.equal(args.name, "abc")
      assert.equal(args.symbol, "def")
      assert.equal(args.tokenAddr.length, 42)

    }
  });

});