pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ITaowa } from "./ITaowa.sol";
import { CustomToken } from "./CustomToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Taowa is ITaowa{

    address[] public groups;

    uint256 public groupsLength;

    // 创建事件
    event Created(string name, string symbol, uint256 supply, address tokenAddr);

    // 铸造事件
    event MintMulti(address tokenAddr, uint256 supply);

    // 赎回事件
    event Redeem(address tokenAddr, uint256 supply);

    function create(string memory _name, string memory _symbol, address[] memory _materials, uint[] memory _amounts) override external returns(address) {
        CustomToken token = new CustomToken(_name, _symbol);
        token.fuse(_materials, _amounts);
        address addr = address(token);

        groups.push(addr);
        groupsLength +=1;
        emit Created(_name, _symbol, 0, addr);
        return addr;
    }

    // 合成
    function mintMulti(
        address erc20Addr,
        address[] calldata _tokens,
        uint256[] calldata _amounts
    )
        override external
        returns (uint256)
    {
        uint256 len = _tokens.length;
        require(len > 0, "_tokens length must > 0");
        require(len == _amounts.length, "lenght must be equal");

        // TODO
        // _tokens 必须与 token.materials 一致，顺序不重要

        // 将资产划转到合约
        for(uint256 i = 0; i < len; i++) {
            CustomToken token = CustomToken(_tokens[i]);

            token.transferFrom(msg.sender, address(this), _amounts[i]); // safeTransferFrom
        }

        emit MintMulti(erc20Addr, 1e18);

        CustomToken(erc20Addr).mint(msg.sender, 1e18);
        return 1e18;
    }

    function redeem(address erc20Addr, uint256 _amount)
    override external returns (uint256){
        CustomToken token = CustomToken(erc20Addr);

        uint len = token.materialength();

        for(uint i = 0; i < len; i++) {
            uint num = token.amounts(i) * _amount;

            ERC20 newtoken = ERC20(token.materials(i));

            // 返还原来的币种
            newtoken.transfer(msg.sender, num); // safeTransferFrom
        }

        uint burn = _amount * (1e18);
        token.burn(msg.sender, burn); // 销毁合成的币种
        emit Redeem(erc20Addr, burn);
        return burn;
    }

    function getTokenList() public view returns(address[] memory) {
        return groups;
    }

}
