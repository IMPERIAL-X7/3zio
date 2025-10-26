import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VerifierModule", (m) => {
  // Deploy the Groth16Verifier contract
  const verifier = m.contract("Groth16Verifier");

  // (Optional) Call a function after deployment if needed
  // m.call(verifier, "verifyProof", [a, b, c, input]);

  return { verifier };
});
