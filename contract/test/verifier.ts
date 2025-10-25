import { expect } from "chai";
import hre from "hardhat";
import fs from "fs";
import path from "path";
import { Contract } from "ethers";

describe("Groth16 Verifier", function () {
  let verifier: Contract;

  before(async function () {
    const Verifier = await hre.ethers.getContractFactory("Verifier");
    verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
  });

  it("should verify a valid zkSNARK proof from file", async function () {
    // --- Load proof and public signals from snarkjs outputs ---
    const proofPath = path.join(__dirname, "../proofs/proof.json");
    const publicPath = path.join(__dirname, "../proofs/public.json");

    if (!fs.existsSync(proofPath) || !fs.existsSync(publicPath)) {
      throw new Error(
        `Proof files not found — please generate them with snarkjs.\nExpected:\n${proofPath}\n${publicPath}`
      );
    }

    const proof = JSON.parse(fs.readFileSync(proofPath, "utf-8"));
    const publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf-8"));

    // --- Parse proof structure ---
    const { pi_a, pi_b, pi_c } = proof;

    const a = [pi_a[0], pi_a[1]];
    const b = [
      [pi_b[0][0], pi_b[0][1]],
      [pi_b[1][0], pi_b[1][1]],
    ];
    const c = [pi_c[0], pi_c[1]];
    const input = publicSignals.map((x: any) => BigInt(x));

    // --- Call verifier ---
    const result = await verifier.verifyProof(a, b, c, input);

    expect(result).to.equal(true);
  });

  it("should reject an invalid proof", async function () {
    const a = [0, 0];
    const b = [
      [0, 0],
      [0, 0],
    ];
    const c = [0, 0];
    const input = [1, 2];

    const result = await verifier.verifyProof(a, b, c, input);
    expect(result).to.equal(false);
  });
});
