import { ethers } from "hardhat";

async function main() {
  const Verifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await Verifier.deploy();

  await verifier.waitForDeployment();

  console.log("Verifier deployed at:", await verifier.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
