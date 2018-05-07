var Ownable = artifacts.require("Ownable");
var Accessable = artifacts.require("Accessable");
var EternalStorage = artifacts.require("EtherHarvestStorage");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Accessable);
  deployer.deploy(EternalStorage);
}
