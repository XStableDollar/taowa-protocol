pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ITaowa } from "./ITaowa.sol";
import { CustomToken } from "./CustomToken.sol";

contract Taowa is ITaowa{

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

    function create(string memory _name, string memory _symbol) override external returns(address) {
        CustomToken token = new CustomToken(_name, _symbol);

        // uint256[] memory ratios = new uint256[](1);
        // uint256 status = 1;
        // CustomAsset memory asset = CustomAsset(
        //   _name,
        //   _symbol,
        //   address(token),
        //   msg.sender,
        //   block.timestamp,
        //   status,
        //   ratios
        // );

        emit Created(_name, _symbol, 0, address(token));
        return address(token);
    }
}
