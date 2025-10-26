import fs from "fs";
import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

async function main() {
  console.log("Verifying proof on OP chain");

  // === Load verifier ===
  const verifierAddress = "0xaddress";
  const verifier = await ethers.getContractAt(
    "Groth16Verifier",
    verifierAddress
  );

  console.log("Verifier contract loaded at:", verifierAddress);

  // === Load proof and public input ===
  const proofPath = "./proofs/proof.json";
  const publicPath = "./proofs/public.json";

  if (!fs.existsSync(proofPath) || !fs.existsSync(publicPath)) {
    throw new Error(`Proof files not found:\n${proofPath}\n${publicPath}`);
  }

  const proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf8"));

  console.log("Proof loaded successfully");
  console.log("Public signals:", publicSignals);

  // === Format proof components ===
  const a: [string, string] = [proof.pi_a[0], proof.pi_a[1]];
  const b: [[string, string], [string, string]] = [
    [proof.pi_b[0][0], proof.pi_b[0][1]],
    [proof.pi_b[1][0], proof.pi_b[1][1]],
  ];
  const c: [string, string] = [proof.pi_c[0], proof.pi_c[1]];

  // === Call contract ===
  console.log("Calling verifyProof...");
  const isValid = await verifier.verifyProof(a, b, c, publicSignals);

  console.log(`\n✅ Proof verification result: ${isValid}`);

  if (isValid) {
    console.log("🎉 Proof is VALID!");
  } else {
    console.log("❌ Proof is INVALID!");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
