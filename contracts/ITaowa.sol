pragma solidity 0.6.12;

interface ITaowa {

    // 合成一种资产
    function create(string memory name, string memory symbol, address[] memory _materials, uint[] memory _amounts) external returns (address);

    // 发送多种ERC20 铸造一种合成资产
    function mintMulti(address erc20Addr, address[] calldata tokens, uint256[] calldata amounts) external returns (uint256 massetMinted);

    // 赎回合成资产并赎回对应的多个ERC20
    function redeem(address erc20Addr, uint256 _amount) external returns (uint256 redeemed);
}
