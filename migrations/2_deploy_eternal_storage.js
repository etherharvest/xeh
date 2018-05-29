var Ownable = artifacts.require("Ownable");
var Accessable = artifacts.require("Accessable");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Accessable);
}
