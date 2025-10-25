import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

// Load your generated proof and public signals
const proofPath = path.join(__dirname, "../proofs/proof.json");
const publicPath = path.join(__dirname, "../proofs/public.json");

const proofData = JSON.parse(fs.readFileSync(proofPath, "utf8"));
const pubSignals = JSON.parse(fs.readFileSync(publicPath, "utf8"));

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Deploy the verifier
  const Verifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();

  console.log("Verifier deployed at:", await verifier.getAddress());

  // Format the proof data
  const { pi_a, pi_b, pi_c } = proofData.proof;

  const proofA = [pi_a[0], pi_a[1]];
  const proofB = [
    [pi_b[0][1], pi_b[0][0]],
    [pi_b[1][1], pi_b[1][0]],
  ];
  const proofC = [pi_c[0], pi_c[1]];

  // Convert public signals to BigInt array
  const pubInputs = pubSignals.map((x: string) => BigInt(x));

  console.log("Verifying...");
  const verified = await verifier.verifyProof(proofA, proofB, proofC, pubInputs);
  console.log("Verification result:", verified);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
