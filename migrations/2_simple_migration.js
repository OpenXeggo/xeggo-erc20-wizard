const SimpleERC20Creator = artifacts.require("SimpleERC20Creator");

module.exports = function(deployer) {
    deployer.deploy(SimpleERC20Creator);
};