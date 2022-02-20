const BurnERC20Creator = artifacts.require("BurnERC20Creator");
module.exports = function(deployer) {
    deployer.deploy(BurnERC20Creator);
};