pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ITaowa } from "./ITaowa.sol";
import { CustomToken } from "./CustomToken.sol";

contract Taowa is ITaowa{

    address[] public groups;

    uint256 public groupsLength;

    // 创建事件
    event Created(string name, string symbol, uint256 supply, address tokenAddr);

    function create(string memory _name, string memory _symbol, address[] memory _materials, uint[] memory _amounts) override external returns(address) {
        CustomToken token = new CustomToken(_name, _symbol);
        token.fuse(_materials, _amounts);
        address addr = address(token);

        groups.push(addr);
        groupsLength +=1;
        emit Created(_name, _symbol, 0, addr);
        return addr;
    }

    function getTokenList() public view returns(address[] memory) {
        return groups;
    }

}
