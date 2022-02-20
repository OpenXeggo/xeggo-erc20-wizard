const CapERC20Creator = artifacts.require("CapERC20Creator");

module.exports = function(deployer) {
    deployer.deploy(CapERC20Creator);
};