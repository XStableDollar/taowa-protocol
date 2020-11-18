pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20 {
    bool public synthesis; // 是否是合成的
    uint public created; // 合成日期
    address public owner; // 合成人
    uint public materialength; // 资产长度

    address[] public materials; // 币种
    uint[] public amounts; // 比例，最小单位

    constructor (string memory name, string memory symbol) public ERC20(name, symbol) {
        synthesis = true;
        created = block.timestamp;
        owner = msg.sender;
    }

    function fuse(address[] memory _materials, uint[] memory _amounts) public {
        require(_materials.length == _amounts.length);
        require(_materials.length > 0, "materials>0");

        materials = _materials;
        amounts = _amounts;
        materialength = _materials.length;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public {
        _burn(to, amount);
    }
}