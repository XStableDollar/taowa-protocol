const { expectRevert, time } = require('@openzeppelin/test-helpers');
const Taowa = artifacts.require('Taowa.sol');
const erc20 = artifacts.require('MetaToken.sol');

const Web3 = require("web3");
const abi  = require('./abi.json')
const web3 = new Web3("http://localhost:8545");

contract('Taowa', ([alice, bob]) => {

  beforeEach(async () => {
    this.abc = await erc20.new('abc', 'abc', { from: alice });
    this.def = await erc20.new('def', 'def', { from: bob });
  });

  it('Create token', async () => {
    const taowa = await Taowa.deployed();

    const _tokens = [this.abc.address, this.def.address]
    const _amounts = [200, 130]

    const result = await taowa.create("abc", "abc", _tokens, _amounts);

    const logs = result.logs

    let tokenAddr = "";

    for (const log of logs) {
      assert.equal(log.event, "Created")

      const args = log.args;
      console.log(args)

      assert.equal(args.name, "abc")
      assert.equal(args.symbol, "abc")

      tokenAddr = args.tokenAddr

      const contract = new web3.eth.Contract(abi, tokenAddr)

      const synthesis = await contract.methods.synthesis().call()
      const created = await contract.methods.created().call()
      const owner = await contract.methods.owner().call()
      const materialength = await contract.methods.materialength().call()

      const material = await contract.methods.materials(0).call()
      const amount = await contract.methods.amounts(0).call()

      console.log(synthesis)
      console.log(created)
      console.log(owner)
      console.log(materialength)

      console.log(material)
      console.log(amount)

      assert.equal(amount, 200)

    }
  });

});