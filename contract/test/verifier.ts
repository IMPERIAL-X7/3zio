import { expect } from "chai";
import { ethers } from "hardhat";
import fs from "fs";

describe("Verifier", function () {
  it("Should verify a correct proof", async function () {
    const Verifier = await ethers.getContractFactory("Groth16Verifier");
    const verifier = await Verifier.deploy();
    await verifier.waitForDeployment();

    const proof = JSON.parse(fs.readFileSync("proof.json", "utf8"));
    const publicSignals = JSON.parse(fs.readFileSync("public.json", "utf8"));

    // Flatten inputs
    const calldata = await (
      await import("snarkjs")
    ).groth16.exportSolidityCallData(proof, publicSignals);

    const args = JSON.parse("[" + calldata + "]");
    const [a, b, c, input] = args;

    expect(await verifier.verifyProof(a, b, c, input)).to.equal(true);
  });
});
