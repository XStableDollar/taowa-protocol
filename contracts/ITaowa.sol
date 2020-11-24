pragma solidity 0.6.12;

interface ITaowa {

    // 创建一个自定义代码
    function create(string memory name, string memory symbol, address[] memory _materials, uint[] memory _amounts) external returns (address);

    // 多个ERC20代币合成一个自定义代币
    function mintMulti(address erc20Addr, address[] calldata tokens, uint256[] calldata amounts) external returns (uint256 massetMinted);

    // 一个自定义代币赎回对应的多个ERC20
    // function redeem(address _targetAsset, uint256 _bassetAmount) external returns (uint256 massetRedeemed);
}
