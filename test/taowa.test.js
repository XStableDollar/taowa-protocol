const { expectRevert, time } = require('@openzeppelin/test-helpers')
const BN = require('bn.js')

const Taowa = artifacts.require('Taowa.sol')
const Asset = artifacts.require('CustomToken.sol')
const erc20 = artifacts.require('MetaToken.sol')

contract('Taowa contract', ([alice, bob, carol]) => {

  beforeEach(async () => {
    const num = 10000
    this.token1 = await erc20.new('token1', 'token1', { from: carol })
    this.token2 = await erc20.new('token2', 'token2', { from: carol })
    this.token3 = await erc20.new('token3', 'token3', { from: carol })
    this.token4 = await erc20.new('token4', 'token4', { from: carol })
    this.token5 = await erc20.new('token5', 'token5', { from: carol })

    await this.token1.mint(alice, num)
    await this.token2.mint(alice, num)
    await this.token3.mint(alice, num)
    await this.token4.mint(alice, num)
    await this.token5.mint(alice, num)

    this.taowa = await Taowa.deployed(bob)

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

      const contract = await Asset.at(tokenAddr)

      const synthesis = await contract.synthesis()
      const created = await contract.created()
      const owner = await contract.owner()
      const materialength = await contract.materialength()

      const amounts = await contract.getAmounts()
      const materials  = await contract.getMaterials()

      for (let i = 0; i < materialength; i++) {
        const material = await contract.materials(i)
        const amount = await contract.amounts(i)

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

    const contract = await Asset.at(tokenAddr)

    const amounts = await contract.getAmounts()
    const materials = await contract.getMaterials()
    let balance = await contract.balanceOf(alice)

    assert.equal(balance, 0)

    // 非原子化操作 感觉有风险
    await this.token1.approve(this.taowa.address, amounts[0])
    await this.token2.approve(this.taowa.address, amounts[1])

    await this.taowa.mintMulti( // 合成
      tokenAddr,
      materials,
      amounts,
      {from: alice}
    )

    balance = await contract.balanceOf(alice)
    console.log('after', balance)

    assert.equal(balance, 1e18)
  })

  it('redeem', async () => {

    const list = await this.taowa.getTokenList()

    const tokenAddr = list[list.length-1]

    console.log(tokenAddr)

    const contract = await Asset.at(tokenAddr)

    let balance = await contract.balanceOf(alice)

    // 非原子化操作 感觉有风险
    const tx = await contract.approve(this.taowa.address, balance, {from: alice})
    console.log(tx.transactionHash)

    const num = balance.div(new BN((1e18).toString()))

    assert.equal(balance.toString(), "1000000000000000000")

    await this.taowa.redeem(
      tokenAddr,
      num.toNumber(),
      {from: alice}
    )

    balance = await contract.balanceOf(alice)
    console.log("after balance ", balance.toString())
    assert.equal(balance.toString(), "0")

  })

})
