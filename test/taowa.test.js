const { expectRevert, time } = require('@openzeppelin/test-helpers')
const Taowa = artifacts.require('Taowa.sol')
const erc20 = artifacts.require('MetaToken.sol')

const Web3 = require("web3")
const abi = require('./abi.json')
const web3 = new Web3("http://localhost:8545")

contract('Taowa contract', ([alice, bob, carol]) => {

  beforeEach(async () => {
    const num = 100000
    this.token1 = await erc20.new('token1', 'token1', { from: alice })
    this.token2 = await erc20.new('token2', 'token2', { from: bob })
    this.token3 = await erc20.new('token3', 'token3', { from: carol })
    this.token4 = await erc20.new('token4', 'token4', { from: alice })
    this.token5 = await erc20.new('token5', 'token5', { from: alice })

    await this.token1.mint(alice, num)
    await this.token2.mint(alice, num)
    await this.token3.mint(alice, num)
    await this.token4.mint(alice, num)
    await this.token5.mint(alice, num)

    this.taowa = await Taowa.deployed()

    console.log("taowa address: " , this.taowa.address)
  })

  it('Create token', async () => {
    const _token1 = [this.token1.address, this.token2.address]
    const _token2 = [this.token3.address, this.token4.address, this.token5.address]
    await this.taowa.create("rebase", "rebase", _token1, [20, 13])
    await this.taowa.create("elixir", "elixir", _token2, [150, 30, 50])

    console.log("taowa address: " , this.taowa.address)

    const _groupsLength = await this.taowa.groupsLength()
    const groupsLength = _groupsLength.toNumber()
    console.log(groupsLength)

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

  })

  it('getTokenList', async () => {
    const list = await this.taowa.getTokenList()
    console.log(list)
    assert.equal(list.length, 2)
  })

  it('mintMulti', async () => {
    const _token1 = [this.token1.address, this.token2.address]
    await this.taowa.create("gem", "gem", _token1, [20, 13])

    const list = await this.taowa.getTokenList()

    const tokenAddr = list[list.length-1]

    console.log(tokenAddr)

    const contract = new web3.eth.Contract(abi, tokenAddr)

    const amounts = await contract.methods.getAmounts().call()
    const materials = await contract.methods.getMaterials().call()

    let balance = await contract.methods.balanceOf(alice).call()
    assert.equal(balance, 0)

    // await this.token1.increaseAllowance(this.taowa.address, 1000)
    // await this.token2.increaseAllowance(this.taowa.address, 1000)

    await this.token1.approve(this.taowa.address, 1000)
    await this.token2.approve(this.taowa.address, 1000)

    await this.taowa.mintMulti(
      tokenAddr,
      materials,
      amounts,
      {from: alice}
    )

    balance = await contract.methods.balanceOf(alice).call()
    console.log('after', balance)

    assert.equal(balance, 1*10**18)

  })

})
