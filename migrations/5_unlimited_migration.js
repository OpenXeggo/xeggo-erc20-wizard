const UnlimitedERC20Creator = artifacts.require("UnlimitedERC20Creator");

module.exports = function(deployer) {
    deployer.deploy(UnlimitedERC20Creator);
};