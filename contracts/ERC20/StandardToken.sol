//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StandardToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 decimals,
        address tokenOwner,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        require(
            tokenOwner != address(0)
        );
        _mint(tokenOwner, initialSupply * 10**decimals);
    }
}
