const { expectRevert, time } = require('@openzeppelin/test-helpers');
const Taowa = artifacts.require('Taowa.sol');
const erc20 = artifacts.require('MetaToken.sol');

const Web3 = require("web3");
const abi = require('./abi.json')
const web3 = new Web3("http://localhost:8545");

contract('Taowa getList', ([alice, bob, carol]) => {

  beforeEach(async () => {
    this.token1 = await erc20.new('token1', 'token1', { from: alice });
    this.token2 = await erc20.new('token2', 'token2', { from: bob });
    this.token3 = await erc20.new('token3', 'token3', { from: carol });
    this.token4 = await erc20.new('token4', 'token4', { from: alice });
    this.token5 = await erc20.new('token5', 'token5', { from: alice });
    this.taowa = await Taowa.deployed();
  });

  it('Create token', async () => {

    const _token1 = [this.token1.address, this.token2.address, this.token3.address]
    const _token2 = [this.token4.address, this.token5.address]

    await this.taowa.create("rebase", "rebase", _token1, [200, 130, 150]);
    await this.taowa.create("elixir", "elixir", _token2, [30, 50]);

    console.log("taowa address: " , this.taowa.address)

    const groupsLength = await this.taowa.groupsLength()
    console.log(groupsLength.toNumber())

    assert.equal(groupsLength, 2)

    for (var i = 0; i < groupsLength; i++) {
      const tokenAddr = await this.taowa.groups(i)

      console.log("tokenAddr: ", tokenAddr)

      const contract = new web3.eth.Contract(abi, tokenAddr)

      const synthesis = await contract.methods.synthesis().call()
      const created = await contract.methods.created().call()
      const owner = await contract.methods.owner().call()
      const materialength = await contract.methods.materialength().call()

      const amounts = await contract.methods.getAmounts().call()
      const materials  = await contract.methods.getMaterials().call()

      for (let i = 0; i < materialength; i++) {
        const material = await contract.methods.materials(i).call()
        const amount = await contract.methods.amounts(i).call()

        console.log("materials property: " ,material)
        console.log("amounts property: ", amount)
      }

      console.log(synthesis)
      console.log(created)
      console.log(owner)
      console.log(materialength)

      console.log("getMaterials function: " , materials)
      console.log("getAmounts function: ",  amounts)
      console.log("-".repeat(50))
    }

  });

  it('getTokenList', async () => {
    var list = await this.taowa.getTokenList()
    console.log(list);
    assert.equal(list.length, 2)
  })

});