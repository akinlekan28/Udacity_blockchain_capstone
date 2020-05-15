var ERC721MintableComplete = artifacts.require('CustomERC721Token')

contract('TestERC721Mintable', (accounts) => {
  const account_one = accounts[0]
  const account_two = accounts[1]
  const account_three = accounts[2]
  const account_four = accounts[3]
  const account_five = accounts[4]
  const account_six = accounts[5]

  describe('match erc721 spec', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one })

      // TODO: mint multiple tokens
      var result = await this.contract.mint(account_two, 1, {
        from: account_one,
      })
      assert(result, 'Failed to mint token 1')

      result = await this.contract.mint(account_three, 2, { from: account_one })
      assert(result, 'Failed to mint token 2')

      result = await this.contract.mint(account_four, 3, { from: account_one })
      assert(result, 'Failed to mint token 3')

      result = await this.contract.mint(account_five, 4, { from: account_one })
      assert(result, 'Failed to mint token 4')

      result = await this.contract.mint(account_six, 5, { from: account_one })
      assert(result, 'Failed to mint token 5')
    })

    it('should return total supply', async function () {
      let total = await this.contract.totalSupply()
      assert.equal(total.toNumber(), 5)
    })

    it('should get token balance', async function () {
      let balance = await this.contract.balanceOf(account_two)
      assert.equal(balance.toNumber(), 1)
    })

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async function () {
      let tokenURI = await this.contract.tokenURI(1)
      assert.equal(
        tokenURI,
        'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1',
      )
    })

    it('should transfer token from one owner to another', async function () {
      await this.contract.approve(account_three, 1, { from: account_one })
      await this.contract.transferFrom(account_two, account_three, 1, {
        from: account_two,
      })
      let bal1 = await this.contract.balanceOf(account_two)
      assert.equal(bal1.toNumber(), 0)
      let bal2 = await this.contract.balanceOf(account_three)
      assert.equal(bal2.toNumber(), 2)
    })
  })

  describe('have ownership properties', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one })
    })

    it('should fail when minting when address is not contract owner', async function () {
      let reverted = false
      try {
        await this.contract.mint(account_six, 6, { from: account_six })
      } catch (e) {
        reverted = true
      }
      assert(reverted, 'Only contract owner can mint new token')
    })

    it('should return contract owner', async function () {
      let owner = await this.contract.getOwner()
      assert.equal(owner.toString(), account_one)
    })
  })
})
