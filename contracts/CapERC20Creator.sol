//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC20/MintableToken.sol";
import "./ERC20/CommonToken.sol";

contract CapERC20Creator is Ownable {
    mapping(address => address[]) public userTokensList;
    event TokenCreated(address _token);

    function createMintableToken(
        string memory name,
        string memory symbol,
        uint256 decimals,
        uint256 initialSupply,
        uint256 cap
    ) public {
        MintableToken token = new MintableToken(
            name,
            symbol,
            decimals,
            msg.sender,
            initialSupply,
            cap
        );
        userTokensList[msg.sender].push(address(token));
        emit TokenCreated(address(token));
    }

    function createCommonToken(
        string memory name,
        string memory symbol,
        uint256 decimals,
        uint256 initialSupply,
        uint256 cap
    ) public {
        CommonToken token = new CommonToken(
            name,
            symbol,
            decimals,
            msg.sender,
            initialSupply,
            cap
        );
        userTokensList[msg.sender].push(address(token));
        emit TokenCreated(address(token));
    }

    // Get tokens by a user
    function getTokens() public view returns (address[] memory userTokens) {
        userTokens = userTokensList[msg.sender];
    }
}
