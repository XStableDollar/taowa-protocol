pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ITaowa } from "./ITaowa.sol";
import { CustomToken } from "./CustomToken.sol";

contract Taowa is ITaowa{

    address[] public customAssets;

    uint256 public totalAssets;

    // 合成币地址对应合成币的信息
    mapping(address => CustomAsset) public ercAddrToCustomToken;

    // 合成币对应的比例
    mapping(address => uint256[]) public token2ratio;

    // 合成币对应的币种
    mapping(address => address[]) public token2symbol;

    // 用户自定义资产 输出
    struct CustomAsset {
      string name;
      string symbol;
      address target;
      address owner;  // 谁的地址合成的
      uint created; // 时间
      uint256 status;  // 预留状态
      uint256[] ratio;
    }

    // 待合成资产 输入
    struct PreToken {
      address tokenAddr;
      uint256 amount;
    }

    // 创建事件
    event Created(string name, string symbol, uint256 supply, address tokenAddr);

    function create(string memory _name, string memory _symbol, address[] memory _materials, uint[] memory _amounts) override external returns(address) {
        CustomToken token = new CustomToken(_name, _symbol);
        token.fuse(_materials, _amounts);

        emit Created(_name, _symbol, 0, address(token));
        return address(token);
    }

}
