// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommonToken is ERC20Burnable, Ownable {
    uint256 private immutable _cap;
    constructor(
        string memory name,
        string memory symbol,
        uint256 decimals,
        address tokenOwner,
        uint256 initialSupply,
        uint256 cap_
    ) ERC20(name, symbol) {
        require(
            tokenOwner != address(0)
        );
        require(cap_ > 0);
        require(cap_ > initialSupply);
        _cap = cap_;
        _mint(tokenOwner, initialSupply * 10 ** decimals);
    }

    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(ERC20.totalSupply() + amount <= cap());
        _mint(to, amount);
    }
}