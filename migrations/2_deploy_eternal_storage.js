var EternalStorage = artifacts.require("EtherHarvestStorage");
var Accessable = artifacts.require("Accessable");

module.exports = function(deployer) {
  deployer.deploy(EternalStorage);
  deployer.deploy(Accessable)
}
