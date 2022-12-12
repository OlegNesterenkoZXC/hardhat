// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const price = hre.ethers.utils.parseEther('2.0');
  const discountRate = 1;
  const name = "Car";

  const DutchAuction = await hre.ethers.getContractFactory("DutchAuction", deployer);
  const auction = await DutchAuction.deploy(price, discountRate, name);

  const deployedContract = await auction.deployed();

  fs.writeFileSync(
        path.resolve(__dirname, '../front/contracts/DutchAuction-address.json'),
        JSON.stringify({DutchAuction: deployedContract.address}, undefined, 2)
  )

  const contractArtifact = hre.artifacts.readArtifactSync("DutchAuction");

  fs.writeFileSync(
      path.resolve(__dirname, `../front/contracts/DutchAuction.json`),
      JSON.stringify(contractArtifact, undefined, 2),
  )

  //console.log("Deployer with", await deployer.getAddress());
  //console.log("Deploying contract with", deployedContract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
