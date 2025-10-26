import fs from "fs";

import { expect } from 'chai'
import hre from 'hardhat'
import "@nomicfoundation/hardhat-ethers";



async function main() {
  // === Load verifier ===
  const verifierAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const verifier = await hre.ethers.getContractAt("Groth16Verifier", verifierAddress);

  // === Load proof and public input ===
  const proof = JSON.parse(fs.readFileSync("./proof.json", "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync("./public.json", "utf8"));

  // === Format proof components ===
  const a = proof.pi_a.slice(0, 2);
  const b = [proof.pi_b[0].slice(0, 2), proof.pi_b[1].slice(0, 2)];
  const c = proof.pi_c.slice(0, 2);

  // === Call contract ===
  const isValid = await verifier.verifyProof(a, b, c, publicSignals);

  console.log(`✅ Proof verification result: ${isValid}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
