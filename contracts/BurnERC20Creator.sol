//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC20/BurnableToken.sol";
import "./ERC20/PausableToken.sol";

contract BurnERC20Creator is Ownable {
    mapping(address => address[]) public userTokensList;
    event TokenCreated(address _token);

    function createBurnableToken(
        string memory name,
        string memory symbol,
        uint256 decimals,
        uint256 initialSupply
    ) public {
        BurnableToken token = new BurnableToken(
            name,
            symbol,
            decimals,
            msg.sender,
            initialSupply
        );
        userTokensList[msg.sender].push(address(token));
        emit TokenCreated(address(token));
    }

    function createPausableToken(
        string memory name,
        string memory symbol,
        uint256 decimals,
        uint256 initialSupply
    ) public {
        PausableToken token = new PausableToken(
            name,
            symbol,
            decimals,
            msg.sender,
            initialSupply
        );
        userTokensList[msg.sender].push(address(token));
        emit TokenCreated(address(token));
    }

    // Get tokens by a user
    function getTokens() public view returns (address[] memory userTokens) {
        userTokens = userTokensList[msg.sender];
    }
}
