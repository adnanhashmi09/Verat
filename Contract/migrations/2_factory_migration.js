const Factory = artifacts.require('./Factory.sol');

module.exports = async function(deployer, network, accounts){

    await deployer.deploy(Factory);
}